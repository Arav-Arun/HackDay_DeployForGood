import React from "react";
import { NavLink } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./Sidebar.css";

import logo from "../../assets/logo.svg";

const Sidebar = () => {
  const { isConnected } = useAccount();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={logo}
          alt="LoreMint Logo"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Navigation Icons */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          title="Home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          title="Explore"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          title="Dashboard"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          title="Profile"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        {/* User Avatar / Connect */}
        <div className="sidebar-user">
          {isConnected ? (
            <div className="user-avatar-btn">
              <ConnectButton.Custom>
                {({ account, openAccountModal }) => (
                  <button onClick={openAccountModal} className="avatar-trigger">
                    <div className="avatar-placeholder">
                      {account?.displayName?.charAt(0) || "?"}
                    </div>
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="nav-item connect-btn"
                  title="Connect Wallet"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 10H2" />
                    <circle cx="17" cy="14" r="2" />
                  </svg>
                </button>
              )}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
