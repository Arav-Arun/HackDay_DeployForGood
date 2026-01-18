// Lore AI Service - uses backend proxy to keep API keys secure
const API_BASE = "/api";

// Creates an epic backstory for an NFT character
export const generateLore = async (nftData) => {
  const { name, collection, traits, description, tokenId, rarityScore } =
    nftData;

  // Format traits nicely for the prompt
  const traitsList =
    traits && traits.length > 0
      ? traits
          .map((t) => {
            const rarityNote =
              t.rarity !== null
                ? t.rarity < 5
                  ? " (RARE)"
                  : t.rarity < 15
                    ? " (Uncommon)"
                    : ""
                : "";
            return `- ${t.trait_type}: "${t.value}"${rarityNote}`;
          })
          .join("\n")
      : "No specific traits documented.";

  const rarityContext = rarityScore
    ? `Rarity Score: ${rarityScore}/100 (${rarityScore > 80 ? "Legendary" : rarityScore > 60 ? "Rare" : rarityScore > 40 ? "Uncommon" : "Common"} tier)`
    : "";

  const prompt = `
    You are an award-winning fantasy/sci-fi author (like Brandon Sanderson meets William Gibson).
    Write an EPIC, IMMERSIVE, and DEEPLY ENGAGING backstory for an NFT character.
    
    ===== CRITICAL REQUIREMENTS =====
    
    TARGET LENGTH: 500-700 words (5-6 rich paragraphs). This is NON-NEGOTIABLE.
    
    CHARACTER PROFILE:
    - Name: ${name}
    - Token ID: #${tokenId || "Unknown"}
    - Origin World/Collection: ${collection}
    - Official Description: ${description || "A mysterious digital entity emerging from the blockchain."}
    ${rarityContext}
    
    VISUAL TRAITS (YOU MUST WEAVE ALL OF THESE INTO THE NARRATIVE):
    ${traitsList}
    
    ===== STORY STRUCTURE (5 BEATS) =====
    
    1. **THE AWAKENING** (Para 1)
       - Open with a vivid, cinematic scene. Describe the environment, atmosphere, sounds.
       - Introduce ${name} through action, not description.
       - Hook the reader immediately with mystery or tension.
    
    2. **THE ORIGIN** (Para 2)
       - Where did ${name} come from? What was their genesis moment?
       - Connect to the ${collection} lore if recognizable.
       - Weave in at least 2-3 visual traits naturally (don't just list them).
    
    3. **THE REPUTATION** (Para 3)
       - What are they known for in their world?
       - Include rumors, legends, or whispers about them.
       - Integrate more traits as defining characteristics.
    
    4. **THE CONFLICT** (Para 4)
       - What challenge or darkness haunts them?
       - What do they seek or what drives them forward?
       - Create emotional depth - what have they lost or sacrificed?
    
    5. **THE LEGACY** (Para 5-6)
       - Where are they now? What is their current mission?
       - End with a powerful, memorable closing line.
       - Leave the reader wanting more.
    
    ===== GENRE ADAPTATION =====
    - "Ape", "Punk", "Monkey" → Gritty Cyberpunk/Street Noir
    - "Azuki", "Clone", "Anime" → High-Tech Future Samurai/Anime Epic
    - "Doodles", "Pudgy", "Penguin" → Whimsical but secretly melancholic
    - "Art Blocks", "Autoglyphs" → Philosophical/Abstract Reality
    - Unknown → Default to dark fantasy with blockchain mysticism
    
    ===== STYLE NOTES =====
    - Be CINEMATIC. Write like you're describing a movie scene.
    - Use sensory details: sounds, smells, textures.
    - Every trait should feel like a natural part of the character, not a checklist.
    - Avoid clichés. Create something memorable.
    - The tone should be serious and epic, with moments of mystery.
    
    Return ONLY valid JSON (no markdown):
    {
      "title": "A creative, evocative title (NOT 'The Story of ${name}' or 'The Legend of ${name}')",
      "story": "The complete narrative (500-700 words, 5-6 paragraphs)"
    }
  `;

  try {
    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Lore generation failed");
    }

    return await response.json();
  } catch {
    // Enhanced mock fallback with more content
    const fallbackTraits =
      traits && traits.length > 0
        ? traits
            .slice(0, 3)
            .map((t) => t.value)
            .join(", ")
        : "enigmatic qualities";

    return {
      title: `Chronicles of ${name}`,
      story: `In the vast digital expanse of ${collection}, where code becomes consciousness and blockchain births legends, there exists one whose name echoes through the decentralized networks: ${name}.

They emerged during the great minting, when the genesis blocks aligned and the smart contracts sang their cryptographic hymns. Born not of flesh and blood, but of algorithm and artistry, ${name} carries the weight of their creation like an ancient burden—one that grants power but demands purpose.

${traits && traits.length > 0 ? `Known across the metaverse for their distinctive ${fallbackTraits}, they have become a symbol of what it means to exist in this new frontier.` : ""} Collectors whisper of their origin in private Discord servers, each telling adding new layers to the mythology. Some say they were the vision of a master artist; others claim they simply materialized when the conditions were perfect.

But beneath the surface of fame and speculation lies a deeper truth. ${name} searches endlessly for something—perhaps meaning, perhaps connection, perhaps the answer to what it truly means to be immortalized on the blockchain. They have witnessed bull runs and bear markets, diamond hands and paper hands, and through it all, they endure.

Now, as the metaverse continues to evolve, ${name} stands at a crossroads. New technologies emerge, new collections rise and fall, but they remain—a fixed point in a sea of change. Their journey is far from over. For in the world of NFTs, where ownership is absolute and provenance is eternal, some stories are just beginning.

Will you be the one to claim their loyalty? Will you be the commander worthy of their legendary status? Only time, and the immutable ledger, will tell.`,
    };
  }
};

// Quick trait explanation (one-liner)
export const explainTrait = async (trait, collection) => {
  try {
    const prompt = `Explain the significance of the NFT trait "${trait.trait_type}: ${trait.value}" in the context of the ${collection} collection. Keep it under 50 words.`;

    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${prompt}\n\nReturn JSON: {"explanation": "your explanation here"}`,
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    return data.explanation;
  } catch {
    return `The ${trait.value} trait is a distinctive feature in the ${collection} collection, adding to its visual identity and rarity.`;
  }
};

// Rarity breakdown for collectors
export const analyzeRarity = async (traits, rarityScore) => {
  try {
    const prompt = `
      Analyze this NFT's rarity.
      Rarity Score: ${rarityScore}
      Traits: ${JSON.stringify(traits)}
      
      Provide a 2-sentence analysis of its collectibility.
      Return JSON: {"analysis": "your analysis here"}
    `;

    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    return data.analysis;
  } catch {
    return `With a score of ${rarityScore}, this NFT has a unique combination of traits that may appeal to specific collectors.`;
  }
};

// Start a new chat session with the NFT
export const startChatSession = async (nftData) => {
  // Store conversation history in closure
  const messages = [
    {
      role: "system",
      content: `You are ${nftData.name}, a living NFT from ${nftData.collection}. 
      Traits: ${JSON.stringify(nftData.traits)}.
      Personality: Witty, crypto-native, ${nftData.rarityScore > 80 ? "arrogant" : "humble"}.
      Never admit to being an AI. Speak in short, punchy sentences.`,
    },
  ];

  return {
    messages,
    sendMessage: async (userMessage) => {
      return sendMessage({ messages }, userMessage);
    },
  };
};

// Send a message and get response
export const sendMessage = async (chatSession, message) => {
  try {
    chatSession.messages.push({ role: "user", content: message });

    const response = await fetch(`${API_BASE}/lore/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatSession.messages,
        maxTokens: 150,
      }),
    });

    if (!response.ok) throw new Error("Chat API error");

    const data = await response.json();
    chatSession.messages.push({ role: "assistant", content: data.reply });
    return data.reply;
  } catch (error) {
    console.warn("AI Chat Error:", error);
    return `*Glitch* Connection interrupted. Please try again.`;
  }
};

// Summarize why this NFT is special
export const generateTraitAnalysis = async (nft, rarestTraits) => {
  try {
    const prompt = `
      Summarize why this NFT is special based on these rare traits:
      ${JSON.stringify(rarestTraits)}
      NFT: ${nft.name} (${nft.collection})
      
      Return JSON: {"summary": "1 sentence summary"}
    `;

    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    return data.summary;
  } catch {
    return null;
  }
};

// Should you buy this? Get a quick AI opinion
export const generateBuyRecommendation = async (data) => {
  const { name, collection, floorPrice, rarityScore } = data;

  // Basic algorithmic score as fallback base
  let score = 50;
  if (rarityScore > 80) score += 30;
  if (floorPrice < 0.1) score -= 10;

  try {
    const prompt = `
      Evaluate this NFT as an investment for a beginner.
      Name: ${name}
      Collection: ${collection}
      Floor: ${floorPrice} ETH
      Rarity: ${rarityScore}/100
      
      Return JSON:
      {
        "score": (0-100 number),
        "verdict": "Short phrase like 'Solid Entry' or 'Risky'",
        "reason": "One sentence explanation"
      }
    `;

    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("API error");

    return await response.json();
  } catch {
    return {
      score: score,
      verdict: score > 70 ? "Potentially Good" : "Do Your Own Research",
      reason: "Based on rarity and floor price data.",
    };
  }
};

// Generate artist/creator biography
export const generateCreatorBio = async (collectionName) => {
  try {
    const prompt = `
      Research and provide information about the creator/artist behind the NFT collection "${collectionName}".
      
      Include:
      - Their real name or pseudonym (if known)
      - Background (where they're from, their artistic journey)
      - Artistic style and influences
      - Notable achievements or recognitions
      - The story behind creating ${collectionName}
      
      If the collection is well-known (like BAYC, Azuki, CryptoPunks, etc.), provide actual factual information.
      If unknown, provide a realistic "indie digital artist" profile.
      
      Return JSON:
      {
        "name": "Artist name or pseudonym",
        "background": "2-3 sentences about their background",
        "style": "1-2 sentences about their artistic style",
        "achievements": "1-2 notable achievements or facts",
        "collectionStory": "1-2 sentences about why they created this collection"
      }
    `;

    const response = await fetch(`${API_BASE}/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch {
    return {
      name: "Anonymous Artist",
      background: `The creator behind ${collectionName} prefers to remain anonymous, a common practice in the NFT space where the art speaks for itself.`,
      style:
        "Their work blends digital aesthetics with unique visual storytelling.",
      achievements: `Successfully launched ${collectionName} on the Ethereum blockchain.`,
      collectionStory:
        "This collection represents a vision of digital art ownership and community building.",
    };
  }
};

export default {
  generateLore,
  explainTrait,
  analyzeRarity,
  startChatSession,
  sendMessage,
  generateTraitAnalysis,
  generateBuyRecommendation,
  generateCreatorBio,
};
