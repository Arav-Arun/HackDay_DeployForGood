import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NFTDetail from "./pages/NFTDetail";
import Explore from "./pages/Explore";
import Collection from "./pages/Collection";
import Profile from "./pages/Profile";

// Wrapper to conditionally show sidebar
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className={isLandingPage ? "" : "app-layout"}>
      {!isLandingPage && <Sidebar />}
      <main className={isLandingPage ? "" : "app-main"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/nft/:contractAddress/:tokenId"
            element={<NFTDetail />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/collection/:contractAddress" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
