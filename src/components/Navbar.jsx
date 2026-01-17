import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import GasTracker from "./GasTracker";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { isConnected } = useAccount();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">LoreMint</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/explore"
            className={`nav-link ${isActive("/explore") ? "active" : ""}`}
          >
            Explore
          </Link>

          {isConnected && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                My Collection
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <GasTracker />
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
