import React, { useState, useEffect, useRef } from "react";
import { startChatSession, sendMessage } from "../../../services/chatAI";
import "./LivingNFTChat.css";

const LivingNFTChat = ({ nft }) => {
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chat when NFT loads
  useEffect(() => {
    const initChat = async () => {
      if (nft) {
        try {
          const session = await startChatSession(nft);
          setChatSession(session);
          // Set initial greeting for visual effect since we don't auto-run the first turn
          setMessages([
            {
              role: "model",
              text: `Hey! What's up?`,
            },
          ]);
        } catch (error) {
          console.error("Failed to start chat:", error);
        }
      }
    };
    initChat();
  }, [nft]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatSession) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(chatSession, userMsg);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "*Static noise* (Connection failed)" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="living-nft-chat glass-card">
      <div className="chat-header">
        <div className="status-indicator online"></div>
        <h3>Chat with {nft.name}</h3>
        {/* Badge removed to be subtle as requested */}
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.role === "model" && (
              <div className="avatar">
                <img
                  src={nft.image}
                  alt={nft.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40?text=?";
                  }}
                />
              </div>
            )}
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message model">
            <div className="avatar">
              <img
                src={nft.image}
                alt={nft.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/40?text=?";
                }}
              />
            </div>
            <div className="bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${nft.name} about its rarity...`}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default LivingNFTChat;
