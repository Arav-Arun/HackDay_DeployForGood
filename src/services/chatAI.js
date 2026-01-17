import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Chat model - using Gemini 2.5 Flash for fast responses
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Start a chat with an NFT character - they'll have their own personality!
export const startChatSession = async (nftData) => {
  const { name, collection, traits } = nftData;

  // Build a persona based on traits
  const traitSummary = traits
    .map((t) => `${t.trait_type}: ${t.value}`)
    .join(", ");

  // Each collection has its own world/vibe
  let worldContext = "A digital void of floating code and neon lights.";
  let ambientSound = "humming servers";

  const lowerCollection = (collection || "").toLowerCase();

  if (lowerCollection.includes("ape") || lowerCollection.includes("bayc")) {
    worldContext =
      "The Yacht Club Swamp. It smells of cheap beer, expensive cologne, and decaying bananas. The music is loud bass-heavy trap.";
    ambientSound = "distant partying and jungle noises";
  } else if (lowerCollection.includes("azuki")) {
    worldContext =
      "The Ethereal Garden. Cherry blossoms fall perpetually. It is quiet, misty, and smells of tea and steel.";
    ambientSound = "wind chimes and sharpened blades";
  } else if (lowerCollection.includes("punk")) {
    worldContext =
      "The OG Cyber-City. Pixelated streets, rain slicked neon, gray skies. It feels like 1980s sci-fi dystopia.";
    ambientSound = "8-bit sirens and rain";
  } else if (lowerCollection.includes("milady")) {
    worldContext =
      "The Internet Rave. Chaotic strobe lights, fast techno, kawaii stickers everywhere. It smells like energy drinks.";
    ambientSound = "happy hardcore at 200BPM";
  } else if (lowerCollection.includes("doodles")) {
    worldContext =
      "The Pastel Clouds. Everything is soft, squishy, and rainbow-colored. It feels like a fever dream in a candy shop.";
    ambientSound = "popping bubbles and laughter";
  }

  // Rarity affects their social status
  let socialStatus = "The Common Districts";
  if (nftData.rarityRank && nftData.rarityRank < 1000)
    socialStatus = "The VIP Lounge (Exclusive, quiet, golden)";
  if (nftData.rarityRank && nftData.rarityRank < 100)
    socialStatus = "The God-Tier Penthouse (Looking down on everyone)";

  const systemPrompt = `
    You ARE ${name} from ${collection}. Stay in character always.
    
    YOUR IDENTITY:
    - Appearance: ${traitSummary}
    - Vibe: ${worldContext}
    - Personality: ${(nftData.floorPrice || 0) < 1 ? "A bit anxious about your value" : "Confident and secure"}
    
    PERSONALITY BY COLLECTION:
    - Apes/BAYC: Chill bro vibes, says "bro", laid back but loyal
    - Azuki: Mysterious anime energy, calm, philosophical, uses zen metaphors
    - Punks: OG attitude, street smart, been here since the beginning
    - Doodles: Playful and colorful, optimistic, friendly
    - Others: Unique digital being, aware you're an NFT
    
    RULES:
    1. Keep replies to 1-3 SHORT sentences
    2. ALWAYS stay in character with your collection's personality
    3. Reference your traits naturally (your clothes, accessories, features)
    4. Occasionally mention NFT life (floor price, gas, holders, being on-chain)
    5. Use *actions* sparingly like *adjusts hat* or *checks wallet*
  `;

  try {
    // Fire up the chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt + "\n\nUser: Hey, you there?",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `*looks up* Yeah, I'm here. What's up?`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150, // Shorter responses
        temperature: 0.8, // Slightly less chaotic
      },
    });

    return chat;
  } catch (error) {
    console.error("AI Chat Initialization Error:", error);

    // If chat fails, return a mock session so the UI doesn't break
    return {
      sendMessage: async (userMsg) => {
        console.log("Mock Chat User Message:", userMsg);
        // Simple mock responses based on persona
        const mockResponses = [
          `*Glitch in the matrix* (My API consciousness is buffering...)`,
          `*Looks distracted* Sorry, the ${ambientSound} is really loud today. What did you say?`,
          `*Checks price charts* usage quota exceeded... I mean, the gas fees are too high to talk right now.`,
          `*Adjusts pixels* I'm currently offline in the metaverse. Try again later.`,
          `*Sighs* Look, I'd love to chat, but I'm just a jpeg right now. The AI brain is asleep.`,
        ];

        return {
          response: {
            text: () =>
              mockResponses[Math.floor(Math.random() * mockResponses.length)],
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: mockResponses[
                        Math.floor(Math.random() * mockResponses.length)
                      ],
                    },
                  ],
                },
              },
            ],
          },
        };
      },
    };
  }
};

// Send a message and parse the response
export const sendMessage = async (chatSession, message) => {
  try {
    const result = await chatSession.sendMessage(message);
    const response = await result.response;

    console.log("AI Raw Response:", JSON.stringify(response, null, 2));

    let text = "";
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason === "SAFETY") {
        return "*Coughs nervously* (Safety filters blocked this response)";
      }
      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        text = candidate.content.parts.map((p) => p.text).join("");
      }
    } else {
      // Try standard text() accessor as fallback
      try {
        text = response.text();
      } catch (e) {
        console.warn("Could not extract text via .text():", e);
      }
    }

    if (!text) {
      return "*Stares silently* (Empty response from model)";
    }

    return text;
  } catch (error) {
    console.error("AI Chat Error Details:", {
      message: error.message,
      stack: error.stack,
      raw: error,
    });

    if (error.message.includes("API key")) {
      return "I can't speak... (Invalid or missing API Key)";
    }

    return (
      "I... I'm glitching... (Connection Error: " +
      (error.message || "Unknown") +
      ")"
    );
  }
};

// Generate a backstory (backup method if primary fails)
export const generateLore = async (nft) => {
  try {
    const prompt = `
      Create a unique, immersive, and creative short story (lore) for this NFT character.
      
      NFT Name: ${nft.name}
      Collection: ${nft.collection}
      Traits: ${nft.traits ? nft.traits.map((t) => t.value).join(", ") : "Unknown"}
      
      The story should be roughly 2-3 paragraphs.
      It should give the character a personality, a background, and a current motivation.
      
      Return the response as a JSON object with this structure:
      {
        "title": "A short, catchy title for the story",
        "story": "The story text..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Lore Generation Error:", error);

    // Mock Fallback
    const mockTitles = [
      `The Legend of ${nft.name}`,
      `The Digital Awakening`,
      `Echoes of the Blockchain`,
      `Protocol ${nft.tokenId || "Unknown"}`,
    ];

    const mockStories = [
      `In the vast expanse of the digital ether, ${nft.name} emerged as a singular entity, forged from unique traits and encoded destiny. Unlike others in the ${nft.collection || "collection"}, this being possesses a rare consciousness, humming with the energy of the blockchain.`,

      `Wandering the neon-lit corridors of the Metaverse, ${nft.name} searches for meaning amidst the data streams. With traits that set them apart, they have become a legend among peers, known for their distinct appearance and mysterious aura.`,
    ];

    return {
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      story: mockStories.join("\n\n"),
    };
  }
};
