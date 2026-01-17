# LoreMint 🌌

**LoreMint** is a next-generation NFT analytics and storytelling platform that bridges the gap between on-chain data and creative lore. By leveraging **Alchemy's blockchain data** and **OpenAI's generative capabilities**, LoreMint transforms static NFT metadata into immersive narratives while providing deep financial insights.


## ✨ Key Features

### 🔍 Deep NFT Analytics

- **Real-Time Valuation**: Market-aware rarity scoring engine that combines trait rarity with floor price context.
- **Harmonic Rarity Algorithm**: Advanced statistical model to identify true gems within collections.
- **Collection Insights**: Detailed stats, floor price trends, and volume data fetched instantly via Alchemy.

### 🎭 AI-Powered Lore Generation

- **Generative Backstory**: Creates unique, character-driven stories for every NFT based on its specific traits.
- **Trait Explanation**: contextualizes obscure attributes (e.g., "Why is 'Golden Fur' valuable?").
- **Interactive Storytelling**: Brings static JPEGs to life with rich, immersive text.

### 💎 Premium User Experience

- **Glassmorphism Design**: Modern, sleek UI with frosted glass effects and dynamic gradients.
- **Responsive Layout**: Fully optimized for desktop and mobile devices.
- **Seamless Web3 Integration**: Connect with MetaMask/WalletConnect via Wagmi and Viem.

---

## 🛠️ Technology Stack

### Frontend Core

- **[React 18](https://reactjs.org/)**: Component-based UI library.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for blazing fast builds.
- **[React Router DOM](https://reactrouter.com/)**: Client-side routing.

### Web3 & Blockchain

- **[Alchemy SDK](https://docs.alchemy.com/)**: Primary data source for NFT metadata, ownership, and collection stats.
- **[Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/)**: React hooks for Ethereum wallet connection and interaction.

### Artificial Intelligence

- Google Gemini API

### Visualization & UI

- **[Recharts](https://recharts.org/)**: Composable charting library for price history and rarity distribution.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library for React.
- **[Lucide React](https://lucide.dev/)**: Beautiful, consistent icon set.
- **[CSS Modules](https://github.com/css-modules/css-modules)**: Scoped styling with advanced glassmorphism effects.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- An [Alchemy API Key](https://alchemy.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arav-Arun/LoreMint.git
   cd LoreMint
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your keys:

   ```env
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by Arav Arun
