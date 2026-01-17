import React from "react";
import "./AIFlowViz.css";

const AIFlowViz = () => {
  return (
    <div className="ai-flow-viz glass-card">
      <h3 className="subsection-title text-center">AI Analysis Pipeline</h3>

      <div className="ai-flow-container">
        <div className="ai-node ai-node-input">
          <div className="node-icon">1</div>
          <div className="node-label">Trait Analysis</div>
          <div className="node-desc">Parse metadata & attributes</div>
        </div>

        <div className="ai-connection">
          <svg width="60" height="40" viewBox="0 0 60 40">
            <path
              d="M 0 20 L 60 20"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              fill="none"
              className="ai-connection-line"
            />
            <defs>
              <linearGradient
                id="flowGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#d4a853" />
                <stop offset="100%" stopColor="#f5b041" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="ai-node ai-node-process">
          <div className="node-icon">2</div>
          <div className="node-label">Rarity Interpretation</div>
          <div className="node-desc">Calculate uniqueness score</div>
        </div>

        <div className="ai-connection">
          <svg width="60" height="40" viewBox="0 0 60 40">
            <path
              d="M 0 20 L 60 20"
              stroke="url(#flowGradient2)"
              strokeWidth="2"
              fill="none"
              className="ai-connection-line"
            />
            <defs>
              <linearGradient
                id="flowGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#f5b041" />
                <stop offset="100%" stopColor="#b87333" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="ai-node ai-node-output">
          <div className="node-icon">3</div>
          <div className="node-label">Lore Creation</div>
          <div className="node-desc">Generate unique story</div>
        </div>
      </div>

      <div className="ai-flow-labels">
        <div className="ai-flow-label">
          <span
            className="label-dot"
            style={{ background: "var(--color-neon-purple)" }}
          ></span>
          <span>Analytical AI</span>
        </div>
        <div className="ai-flow-label">
          <span
            className="label-dot"
            style={{ background: "var(--color-neon-cyan)" }}
          ></span>
          <span>Creative AI</span>
        </div>
      </div>
    </div>
  );
};

export default AIFlowViz;
