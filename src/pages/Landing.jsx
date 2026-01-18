import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { getNFTMetadata } from "../services/alchemy";
import "./Landing.css";

// Featured NFTs to showcase - these are iconic pieces
const SHOWCASE_NFTS = [
  {
    contract: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", // CryptoPunks
    tokenId: "7804",
    name: "CryptoPunk #7804",
    rarity: "Legendary",
  },
  {
    contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", // BAYC
    tokenId: "8817",
    name: "BAYC #8817",
    rarity: "Rare",
  },
  {
    contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544", // Azuki
    tokenId: "5306",
    name: "Azuki #5306",
    rarity: "Epic",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [nftImages, setNftImages] = useState({});

  // Fetch real NFT images from Alchemy
  useEffect(() => {
    const fetchNFTImages = async () => {
      const images = {};

      await Promise.all(
        SHOWCASE_NFTS.map(async (nft) => {
          try {
            const metadata = await getNFTMetadata(nft.contract, nft.tokenId);
            if (metadata?.image) {
              images[`${nft.contract}-${nft.tokenId}`] = metadata.image;
            }
          } catch (err) {
            console.warn(`Failed to fetch ${nft.name}:`, err);
          }
        }),
      );

      setNftImages(images);
    };

    fetchNFTImages();
  }, []);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create floating particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 168, 217, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="gradient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              <span className="title-line">Decode the</span>
              <span className="title-accent">True Value</span>
              <span className="title-line">of Every NFT</span>
            </h1>

            <p className="hero-subtitle">
              LoreMint combines on-chain analytics with artificial intelligence
              to reveal what makes each NFT unique — from trait rarity to market
              positioning to cultural significance.
            </p>

            <div className="cta-container">
              <div className="primary-cta">
                <ConnectButton />
              </div>
              <button
                onClick={() => navigate("/explore")}
                className="btn btn-glass"
              >
                <span>Explore Collections</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Floating NFT Preview */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="nft-showcase">
              {/* Main CryptoPunk Card */}
              <div className="showcase-card showcase-main">
                {nftImages[
                  `${SHOWCASE_NFTS[0].contract}-${SHOWCASE_NFTS[0].tokenId}`
                ] ? (
                  <img
                    src={
                      nftImages[
                        `${SHOWCASE_NFTS[0].contract}-${SHOWCASE_NFTS[0].tokenId}`
                      ]
                    }
                    alt={SHOWCASE_NFTS[0].name}
                    className="showcase-image"
                  />
                ) : (
                  <div className="showcase-loading">
                    <div className="loading-pulse"></div>
                  </div>
                )}
                <div className="showcase-overlay">
                  <span className="showcase-label">
                    {SHOWCASE_NFTS[0].name}
                  </span>
                  <span className="showcase-rarity">
                    {SHOWCASE_NFTS[0].rarity}
                  </span>
                </div>
              </div>

              {/* Left Side - BAYC */}
              <div className="showcase-card showcase-side left">
                {nftImages[
                  `${SHOWCASE_NFTS[1].contract}-${SHOWCASE_NFTS[1].tokenId}`
                ] ? (
                  <img
                    src={
                      nftImages[
                        `${SHOWCASE_NFTS[1].contract}-${SHOWCASE_NFTS[1].tokenId}`
                      ]
                    }
                    alt={SHOWCASE_NFTS[1].name}
                    className="showcase-image"
                  />
                ) : (
                  <div className="showcase-loading">
                    <div className="loading-pulse"></div>
                  </div>
                )}
              </div>

              {/* Right Side - Azuki */}
              <div className="showcase-card showcase-side right">
                {nftImages[
                  `${SHOWCASE_NFTS[2].contract}-${SHOWCASE_NFTS[2].tokenId}`
                ] ? (
                  <img
                    src={
                      nftImages[
                        `${SHOWCASE_NFTS[2].contract}-${SHOWCASE_NFTS[2].tokenId}`
                      ]
                    }
                    alt={SHOWCASE_NFTS[2].name}
                    className="showcase-image"
                  />
                ) : (
                  <div className="showcase-loading">
                    <div className="loading-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <motion.div
          className="stats-bar glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Collections</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">Real-Time</span>
            <span className="stat-label">On-Chain</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">AI</span>
            <span className="stat-label">Analysis</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Verified</span>
          </div>
        </motion.div>

        {/* What We Do Section */}
        <section className="features-section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Features</span>
            <h2 className="section-title">NFT Intelligence, Redefined</h2>
            <p className="section-subtitle">
              Go beyond metadata. Understand the story, value, and potential of
              every digital asset.
            </p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Trait Rarity Analysis</h3>
              <p>
                Instantly calculate how rare each trait is across the entire
                collection using on-chain data from Alchemy.
              </p>
            </motion.div>

            <motion.div
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Market-Aware Valuation</h3>
              <p>
                Our algorithm weighs trait rarity against floor price, ensuring
                accurate value assessments across all tiers.
              </p>
            </motion.div>

            <motion.div
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3>AI Deep Analysis</h3>
              <p>
                AI-powered insights explain why an NFT is priced the way it is,
                its cultural significance, and investment outlook.
              </p>
            </motion.div>

            <motion.div
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3>Verified Collection Data</h3>
              <p>
                Curated backstories for top collections like CryptoPunks, BAYC,
                and Azuki — no AI hallucinations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Process</span>
            <h2 className="section-title">How It Works</h2>
          </motion.div>

          <div className="steps-container">
            <motion.div
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Search or Connect</h3>
                <p>
                  Enter any contract address and token ID, or connect your
                  wallet to analyze your own collection.
                </p>
              </div>
            </motion.div>

            <div className="step-connector" />

            <motion.div
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Instant Analysis</h3>
                <p>
                  We fetch real-time data from the blockchain, calculate trait
                  rarity, and prepare the AI context.
                </p>
              </div>
            </motion.div>

            <div className="step-connector" />

            <motion.div
              className="step-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Deep Insights</h3>
                <p>
                  Get a comprehensive research report covering pricing,
                  uniqueness, history, and investment outlook.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="cta-section glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Discover Hidden Value?</h2>
          <p>
            Start analyzing NFTs with the most comprehensive intelligence
            platform available.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="btn btn-primary btn-large"
          >
            Start Exploring
          </button>
        </motion.section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>
            Built with Alchemy SDK, Advanced AI, and love for the NFT ecosystem.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
