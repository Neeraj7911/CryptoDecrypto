import React, { useEffect } from "react";
import "./Purpose.css";

export default function Purpose() {
  useEffect(() => {
    // Circuit animation
    const circuitLines = document.querySelectorAll(".circuit-line");
    circuitLines.forEach((line, i) => {
      line.style.animationDelay = `${i * 0.2}s`;
    });

    // Feature panel hover
    const panels = document.querySelectorAll(".feature-panel");
    panels.forEach((panel) => {
      panel.addEventListener("mouseenter", () => {
        panel.classList.add("active");
      });
      panel.addEventListener("mouseleave", () => {
        panel.classList.remove("active");
      });
    });
  }, []);

  const toggleTechNode = (id) => {
    const node = document.getElementById(`tech-node-${id}`);
    node.classList.toggle("expanded");
  };

  return (
    <div className="purpose-page">
      <svg
        className="circuit-bg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="circuitGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00ddeb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a2338" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g className="circuit-lines">
          <path
            className="circuit-line"
            d="M100,100 H900 V500 H500 V900"
            stroke="url(#circuitGradient)"
          />
          <path
            className="circuit-line"
            d="M200,200 V800 H800"
            stroke="url(#circuitGradient)"
          />
          <path
            className="circuit-line"
            d="M300,300 H700 V700"
            stroke="url(#circuitGradient)"
          />
          <circle
            cx="100"
            cy="100"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
          <circle
            cx="900"
            cy="500"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
          <circle
            cx="200"
            cy="800"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
        </g>
      </svg>

      <header className="data-core">
        <h1>CryptoDecrypto</h1>
        <p>Secure. Real-Time. AI-Driven.</p>
      </header>

      <section className="matrix-timeline">
        <div className="timeline-entry">
          <h2>Project Overview</h2>
          <p>
            CryptoDecrypto is a next-generation cryptocurrency platform designed
            for precision and power. Initially a minor B.Tech project, it’s now
            a full-scale solution integrating secure transactions, real-time
            market tracking, and AI-powered predictions. Our mission: empower
            users with data-driven decisions in the volatile crypto landscape.
          </p>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-panel">
          <h3>Real-Time Crypto Market Tracking</h3>
          <ul>
            <li>Live data via CoinGecko API</li>
            <li>Price trends & market caps</li>
            <li>Historical charts across devices</li>
          </ul>
        </div>
        <div className="feature-panel">
          <h3>Secure Currency Transfer System</h3>
          <ul>
            <li>Unique user IDs (MetaMask-style)</li>
            <li>Firebase-secured transactions</li>
            <li>Fast, encrypted transfers</li>
          </ul>
        </div>
        <div className="feature-panel">
          <h3>AI-Powered Market Predictions</h3>
          <ul>
            <li>Gemini API integration</li>
            <li>Historical + real-time analytics</li>
            <li>Risk reduction & gain optimization</li>
          </ul>
        </div>
        <div className="feature-panel">
          <h3>Authentication & Security</h3>
          <ul>
            <li>Firebase Authentication</li>
            <li>Data encryption</li>
            <li>Best-in-class security protocols</li>
          </ul>
        </div>
        <div className="feature-panel">
          <h3>User-Friendly Dashboard</h3>
          <ul>
            <li>Real-time trend updates</li>
            <li>Portfolio management</li>
            <li>Market alerts</li>
          </ul>
        </div>
      </section>

      <section className="tech-hud">
        <h2>Tech Framework</h2>
        <svg className="hud-display" viewBox="0 0 600 400">
          <rect
            x="50"
            y="50"
            width="500"
            height="300"
            fill="none"
            stroke="url(#hudGradient)"
            strokeWidth="2"
            rx="10"
          />
          <line
            x1="50"
            y1="200"
            x2="550"
            y2="200"
            stroke="#00ddeb"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="300"
            y1="50"
            x2="300"
            y2="350"
            stroke="#00ddeb"
            strokeWidth="1"
            opacity="0.5"
          />
          <g className="tech-nodes">
            <g
              id="tech-node-1"
              className="tech-node"
              onClick={() => toggleTechNode(1)}
            >
              <circle cx="150" cy="100" r="20" fill="url(#nodeGradient)" />
              <text x="150" y="105" textAnchor="middle">
                React
              </text>
              <foreignObject
                x="120"
                y="130"
                width="60"
                height="100"
                className="node-details"
              >
                <div>Frontend (Vite optimized)</div>
              </foreignObject>
            </g>
            <g
              id="tech-node-2"
              className="tech-node"
              onClick={() => toggleTechNode(2)}
            >
              <circle cx="450" cy="100" r="20" fill="url(#nodeGradient)" />
              <text x="450" y="105" textAnchor="middle">
                Node.js
              </text>
              <foreignObject
                x="420"
                y="130"
                width="60"
                height="100"
                className="node-details"
              >
                <div>Backend (Express.js)</div>
              </foreignObject>
            </g>
            <g
              id="tech-node-3"
              className="tech-node"
              onClick={() => toggleTechNode(3)}
            >
              <circle cx="150" cy="300" r="20" fill="url(#nodeGradient)" />
              <text x="150" y="305" textAnchor="middle">
                Firebase
              </text>
              <foreignObject
                x="120"
                y="330"
                width="60"
                height="100"
                className="node-details"
              >
                <div>Database & Auth</div>
              </foreignObject>
            </g>
            <g
              id="tech-node-4"
              className="tech-node"
              onClick={() => toggleTechNode(4)}
            >
              <circle cx="450" cy="300" r="20" fill="url(#nodeGradient)" />
              <text x="450" y="305" textAnchor="middle">
                Gemini
              </text>
              <foreignObject
                x="420"
                y="330"
                width="60"
                height="100"
                className="node-details"
              >
                <div>AI Predictions</div>
              </foreignObject>
            </g>
            <g
              id="tech-node-5"
              className="tech-node"
              onClick={() => toggleTechNode(5)}
            >
              <circle cx="300" cy="200" r="20" fill="url(#nodeGradient)" />
              <text x="300" y="205" textAnchor="middle">
                CoinGecko
              </text>
              <foreignObject
                x="270"
                y="230"
                width="60"
                height="100"
                className="node-details"
              >
                <div>Live Market Data</div>
              </foreignObject>
            </g>
          </g>
          <defs>
            <linearGradient
              id="hudGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00ff99" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ddeb" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient
              id="nodeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00ddeb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00ff99" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      <section className="matrix-timeline">
        <div className="timeline-entry">
          <h2>Development Phase</h2>
          <p>
            Built by Neeraj Kumar. Enhanced by Harsh, Anmol, and Mansi under
            Neeraj’s guidance.
          </p>
        </div>
        <div className="timeline-entry">
          <h2>Future Enhancements</h2>
          <ul>
            <li>Smart contract integration</li>
            <li>Staking & yield farming simulations</li>
            <li>Advanced ML for AI precision</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
