// Chat AI Service - uses backend proxy to keep API keys secure
const API_BASE = "/api";

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

  // Store history locally for conversation continuity
  const history = [
    {
      role: "user",
      parts: [{ text: systemPrompt + "\n\nUser: Hey, you there?" }],
    },
    {
      role: "model",
      parts: [{ text: `*looks up* Yeah, I'm here. What's up?` }],
    },
  ];

  // Return a session object that calls our backend
  return {
    history,
    systemPrompt,
    ambientSound,
    sendMessage: async (userMsg) => {
      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: userMsg,
            history,
          }),
        });

        if (!response.ok) {
          throw new Error("Backend API error");
        }

        const data = await response.json();

        // Update local history
        history.push({ role: "user", parts: [{ text: userMsg }] });
        history.push({ role: "model", parts: [{ text: data.text }] });

        return {
          response: {
            text: () => data.text,
            candidates: [{ content: { parts: [{ text: data.text }] } }],
          },
        };
      } catch (error) {
        console.error("Chat API Error:", error);
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
      }
    },
  };
};

// Send a message and parse the response
export const sendMessage = async (chatSession, message) => {
  try {
    const result = await chatSession.sendMessage(message);
    const response = await result.response;

    let text = "";
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason === "SAFETY") {
        return "*Coughs nervously* (Safety filters blocked this response)";
      }
      if (candidate.content?.parts?.length > 0) {
        text = candidate.content.parts.map((p) => p.text).join("");
      }
    } else {
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

    const response = await fetch(`${API_BASE}/chat/lore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Lore generation failed");
    }

    return await response.json();
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
