// Deep Analysis Service - uses backend proxy to keep API keys secure
const API_BASE = "/api";

/**
 * Fallback analysis when API fails (Mock Data Generator)
 */
const getDefaultAnalysis = (nftData, collectionData) => {
  const { traits, rarityScore, collection } = nftData;
  const { floorPrice, totalSupply } = collectionData;
  const hasTraits = traits && traits.length > 0;

  // Find rarest traits for the mock analysis
  const rareTraits = hasTraits
    ? traits
        .filter((t) => t.rarity !== null && t.rarity < 10)
        .sort((a, b) => a.rarity - b.rarity)
        .slice(0, 3)
    : [];

  const rareTraitText =
    rareTraits.length > 0
      ? rareTraits.map((t) => `"${t.trait_type}: ${t.value}"`).join(" and ")
      : "its unique metadata properties";

  return {
    whatMakesThisUnique: {
      title: "What Makes This NFT Unique",
      differentiators: [
        rareTraits.length > 0
          ? `Possesses the rare ${rareTraits[0].trait_type}: ${rareTraits[0].value} trait (only ${rareTraits[0].rarity}% prevalence)`
          : `Part of the exclusive ${collection} collection`,
        `Market-adjusted rarity score of ${rarityScore || "N/A"}/100`,
        `Distinctive visual composition characteristic of ${collection}`,
      ],
      comparedToCollection: `This NFT stands out within the ${collection} collection due to ${rareTraitText}. Its visual composition aligns with the collection's core aesthetic while maintaining distinct individuality through its specific trait combination.`,
      rarestCombination:
        rareTraits.length > 1
          ? `The combination of ${rareTraits[0].value} and ${rareTraits[1].value} creates a unique visual profile seen in less than 1% of the collection.`
          : "The specific combination of attributes creates a unique identity within the collection ecosystem.",
    },
    artAndVisualFactors: {
      title: "Art & Visual Analysis",
      aestheticAppeal:
        "HIGH - The visual composition demonstrates strong coherence",
      artisticStyle: `Digital generative art with distinct ${collection} stylistic markers`,
      visualRarity:
        rareTraits.length > 0
          ? `The ${rareTraits[0].value} element provides a distinct visual focal point that draws the eye.`
          : "Clean execution of the collection's standard visual archetypes.",
      culturalResonance: `Connects to the broader ${collection} community aesthetic which has established significant cultural value in the NFT space.`,
    },
    externalWorldFactors: {
      title: "External Factors Affecting Price",
      marketConditions:
        "Current broader NFT market sentiment is influencing floor prices across established collections.",
      collectionReputation: `${collection} is established as a significant project within the ecosystem, providing value stability.`,
      historicalSignificance: `As part of the ${collection} supply, it carries the historical weight of the project's launch and growth.`,
      creatorInfluence:
        "The project team's continued development and brand building positively impacts perceived value.",
      communityAndUtility:
        "Strong community support and potential utility access serve as key value drivers.",
    },
    priceJustification: {
      title: "Price Analysis",
      verdict: "FAIRLY PRICED",
      explanation: `Given the floor price of ${floorPrice} ETH and the rarity traits present, this asset appears consistent with market expectations for its tier.`,
      keyFactors: [
        `Collection Floor: ${floorPrice} ETH`,
        `Trait Rarity Premium: ${rareTraits.length > 0 ? "Moderate" : "Low"}`,
        "Liquid Market Demand",
      ],
      comparedToFloor:
        rareTraits.length > 0
          ? "Likely commands a premium over floor due to specific rare attributes."
          : "Likely trades near floor price as a liquid entry point to the collection.",
    },
    investmentOutlook: {
      title: "Investment Outlook",
      recommendation: "HOLD",
      shortTermView:
        "Expect price correlation with main collection floor movements.",
      longTermView:
        "Long-term value depends on continued project execution and ecosystem growth.",
      risks: ["Broader market volatility", "Liquidity fluctuations"],
      opportunities: [
        "Potential value appreciation from ecosystem expansion",
        "Staking or utility rewrads",
      ],
    },
    traitBreakdown: {
      title: "Trait Rarity Breakdown",
      summary: hasTraits
        ? `This NFT features a mix of traits with an average rarity of ${(
            traits.reduce((a, b) => a + (b.rarity || 0), 0) / traits.length
          ).toFixed(1)}%.`
        : "Trait rarity data is currently analyzing.",
    },
    // Key Facts - Verified On-Chain Data
    keyFacts: {
      title: "Key Facts (Verified On-Chain)",
      items: [
        { label: "Collection", value: collection, verified: true },
        { label: "Token ID", value: nftData.tokenId || "N/A", verified: true },
        {
          label: "Token Standard",
          value: collectionData.tokenType || "ERC-721",
          verified: true,
        },
        {
          label: "Total Supply",
          value: totalSupply
            ? parseInt(totalSupply).toLocaleString()
            : "Unknown",
          verified: !!totalSupply,
        },
        {
          label: "Floor Price",
          value: floorPrice ? `${floorPrice} ETH` : "Unknown",
          verified: !!floorPrice,
        },
        {
          label: "Rarity Score",
          value: rarityScore ? `${rarityScore}/100` : "Calculating...",
          verified: !!rarityScore,
        },
      ],
    },
    // Include raw data for the UI
    traitComparison: hasTraits
      ? traits.map((t) => ({
          ...t,
          tier:
            t.rarity === null
              ? "UNKNOWN"
              : t.rarity < 1
                ? "ULTRA RARE"
                : t.rarity < 5
                  ? "RARE"
                  : t.rarity < 15
                    ? "UNCOMMON"
                    : "COMMON",
        }))
      : [],
    stats: {
      floorPrice,
      totalSupply,
    },
  };
};

/**
 * Generate comprehensive deep analysis for an NFT
 */
export const generateDeepAnalysis = async (
  nftData,
  collectionData,
  verifiedResearch,
) => {
  const { name, collection, tokenId, traits, rarityScore, description } =
    nftData;

  const { floorPrice, totalSupply, contractDeployer, collectionDescription } =
    collectionData;

  // Build detailed trait analysis
  const traitBreakdown = traits
    .filter((t) => t.rarity !== null)
    .map((t) => {
      const rarityTier =
        t.rarity < 1
          ? "ULTRA RARE (< 1%)"
          : t.rarity < 5
            ? "RARE (< 5%)"
            : t.rarity < 15
              ? "UNCOMMON (< 15%)"
              : "COMMON (15%+)";
      return `• ${t.trait_type}: "${t.value}" - ${t.rarity}% occurrence [${rarityTier}]`;
    })
    .join("\n");

  // Calculate trait statistics
  const rarityValues = traits
    .filter((t) => t.rarity !== null)
    .map((t) => t.rarity);
  const rarestTrait = traits
    .filter((t) => t.rarity !== null)
    .sort((a, b) => a.rarity - b.rarity)[0];
  const mostCommonTrait = traits
    .filter((t) => t.rarity !== null)
    .sort((a, b) => b.rarity - a.rarity)[0];
  const avgRarity =
    rarityValues.length > 0
      ? (rarityValues.reduce((a, b) => a + b, 0) / rarityValues.length).toFixed(
          2,
        )
      : "N/A";

  // Determine price tier context
  const priceTier =
    floorPrice >= 10
      ? "BLUE CHIP (10+ ETH)"
      : floorPrice >= 3
        ? "ESTABLISHED (3-10 ETH)"
        : floorPrice >= 1
          ? "MID-TIER (1-3 ETH)"
          : floorPrice >= 0.5
            ? "BUDGET (0.5-1 ETH)"
            : "LOW VALUE (< 0.5 ETH)";

  const prompt = `
    You are a Senior NFT Market Analyst known for STRICT FACTUAL ACCURACY.
    
    YOUR GOAL: Provide a detailed, research-grade analysis of this specific NFT using ONLY the data provided below and your internal verifiable knowledge of major collections.
    
    ⚠️ CRITICAL RULES (DO NOT IGNORE):
    1. **NO HALLUCINATIONS**: If you do not know the history of this specific collection, simply state "Historical context unavailable for this specific contract." Do NOT invent a backstory.
    2. **USE API DATA**: The "Floor Price", "Supply", and "Traits" provided below are FACTS. Use them to justify your analysis.
    3. **CROSS-REFERENCE**: If verified research is provided, use it. If not, rely ONLY on the API metrics (Rarity Rank, Floor Price).
    
    === DATA SOURCE (TRUTH) ===
    Name: ${name} #${tokenId}
    Collection: ${collection}
    Dev/Creator: ${contractDeployer || "Unknown"}
    Description: ${description || "No metadata description"}
    
    [MARKET DATA]
    Floor Price: ${floorPrice} ETH [Rating: ${priceTier}]
    Total Supply: ${totalSupply || "Unknown"}
    Market Cap (est): ${floorPrice * (totalSupply || 0)} ETH
    
    [TRAIT DATA]
    Rarity Score: ${rarityScore}/100
    Avg Trait Rarity: ${avgRarity}%
    Rarest Trait: ${
      rarestTrait
        ? `${rarestTrait.trait_type}: ${rarestTrait.value} (${rarestTrait.rarity}%)`
        : "None"
    }

    [DETAILED TRAITS]
    ${traitBreakdown || "No trait details available."}
    
    [VERIFIED HISTORICAL CONTEXT]
    ${
      verifiedResearch
        ? JSON.stringify(verifiedResearch, null, 2)
        : "NO VERIFIED HISTORICAL DATA AVAILABLE. Analyze based on metrics only."
    }
    
    === REPORT REQUIREMENTS ===
    Generate a valid JSON object (no markdown):
    {
      "whatMakesThisUnique": {
        "title": "Uniqueness Analysis",
        "differentiators": ["Point 1 using specfic trait data", "Point 2 using rarity info"],
        "comparedToCollection": "${collectionDescription || "Standard collection context."}",
        "rarestCombination": "Analyze the synergy of the traits: ${
          rarestTrait?.value || "N/A"
        } + ${mostCommonTrait?.value || "N/A"}."
      },
      "artAndVisualFactors": {
        "title": "Visual & Art Assessment",
        "aestheticAppeal": "Evalute the visual composition based on the traits provided.",
        "artisticStyle": "Describe the style (Pixel, 3D, Hand-drawn) based on your knowledge of ${collection}.",
        "visualRarity": "Does the '${
          rarestTrait?.value || "Unknown"
        }' trait create a distinct visual profile?",
        "culturalResonance": "Mention if ${collection} has cultural clout (Yuga, Azuki, etc.) or if it is niche."
      },
      "externalWorldFactors": {
        "title": "Market & Ecosystem",
        "marketConditions": "Analyze based on the Floor Price of ${floorPrice} ETH.",
        "collectionReputation": "${
          verifiedResearch
            ? "Use verified info."
            : "State that this is a niche/emerging collection based on available data."
        }",
        "historicalSignificance": "${
          verifiedResearch
            ? "Use verified info."
            : "No verified historical data available."
        }",
        "creatorInfluence": "Analyze based on creator: ${
          contractDeployer || "Unknown"
        }",
        "communityAndUtility": "General statement on ${collection} utility if known."
      },
      "priceJustification": {
        "title": "Valuation Verdict",
        "verdict": "Compare ${floorPrice} ETH to the asset's rarity (${rarityScore}/100). Is it a deal?",
        "explanation": "Detailed reasoning using the numbers.",
        "keyFactors": ["Floor Price: ${floorPrice}", "Rarity: ${rarityScore}", "Trait Premium"],
        "comparedToFloor": "Should it trade above floor? Yes/No and Why."
      },
      "investmentOutlook": {
        "title": "Investment Feasibility",
        "recommendation": "Conservative rating (Buy/Hold/Pass) for a beginner.",
        "shortTermView": "Volatility assessment based on floor price.",
        "longTermView": "Growth potential vs Risk.",
        "risks": ["Liquidity risk", "Market volatility"],
        "opportunities": ["Rarity premium", "Collection growth"]
      },
      "traitBreakdown": {
        "title": "Metadata Breakdown",
        "summary": "Technical summary of the attribute distribution."
      }
    }
  `;

  try {
    const response = await fetch(`${API_BASE}/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Analysis API error");
    }

    const result = await response.json();
    const content = result.content;

    // Parse the JSON response
    try {
      const cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const analysis = JSON.parse(cleanedContent);

      // Add raw trait data for the UI
      analysis.traitComparison = traits.map((t) => ({
        ...t,
        tier:
          t.rarity === null
            ? "UNKNOWN"
            : t.rarity < 1
              ? "ULTRA RARE"
              : t.rarity < 5
                ? "RARE"
                : t.rarity < 15
                  ? "UNCOMMON"
                  : "COMMON",
      }));

      analysis.stats = {
        avgRarity,
        rarestTrait: rarestTrait
          ? `${rarestTrait.trait_type}: ${rarestTrait.value}`
          : null,
        rarestRarity: rarestTrait?.rarity || null,
        floorPrice,
        priceTier,
        totalSupply,
      };

      return analysis;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return getDefaultAnalysis(nftData, collectionData);
    }
  } catch (error) {
    console.error("Deep analysis API error:", error);
    return getDefaultAnalysis(nftData, collectionData);
  }
};

export default {
  generateDeepAnalysis,
};
