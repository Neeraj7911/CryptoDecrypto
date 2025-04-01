"use client";

import { useEffect, useRef } from "react";
import "./CryptoSVG.css";

const CryptoSVG = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const nodes = svg.querySelectorAll(".node");
    const connections = svg.querySelectorAll(".connection");
    const coins = svg.querySelectorAll(".coin");

    // Animate nodes
    nodes.forEach((node, index) => {
      const delay = index * 200;
      setTimeout(() => {
        node.classList.add("animate");
      }, delay);
    });

    // Animate connections
    connections.forEach((connection, index) => {
      const delay = 1000 + index * 150;
      setTimeout(() => {
        connection.classList.add("animate");
      }, delay);
    });

    // Animate coins
    coins.forEach((coin, index) => {
      const delay = 2000 + index * 300;
      setTimeout(() => {
        coin.classList.add("animate");
      }, delay);

      // Continuous floating animation
      setInterval(() => {
        coin.classList.add("float");
        setTimeout(() => {
          coin.classList.remove("float");
        }, 3000);
      }, 6000 + index * 1000);
    });
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 800 600" className="crypto-svg">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient
          id="coin-gradient-btc"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f7931a" />
          <stop offset="100%" stopColor="#ff9f43" />
        </linearGradient>
        <linearGradient
          id="coin-gradient-eth"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#627eea" />
          <stop offset="100%" stopColor="#3498db" />
        </linearGradient>
        <linearGradient
          id="coin-gradient-ltc"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#345d9d" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Central node */}
      <circle className="node central" cx="400" cy="300" r="60" />
      <text x="400" y="305" textAnchor="middle" className="node-text">
        AI Core
      </text>

      {/* Surrounding nodes */}
      <circle className="node" cx="200" cy="200" r="40" />
      <text x="200" y="205" textAnchor="middle" className="node-text">
        Market
      </text>

      <circle className="node" cx="600" cy="200" r="40" />
      <text x="600" y="205" textAnchor="middle" className="node-text">
        Security
      </text>

      <circle className="node" cx="200" cy="400" r="40" />
      <text x="200" y="405" textAnchor="middle" className="node-text">
        Transfer
      </text>

      <circle className="node" cx="600" cy="400" r="40" />
      <text x="600" y="405" textAnchor="middle" className="node-text">
        Predict
      </text>

      {/* Connections */}
      <line className="connection" x1="400" y1="300" x2="200" y2="200" />
      <line className="connection" x1="400" y1="300" x2="600" y2="200" />
      <line className="connection" x1="400" y1="300" x2="200" y2="400" />
      <line className="connection" x1="400" y1="300" x2="600" y2="400" />

      {/* Cryptocurrency coins */}
      <g className="coin btc" transform="translate(300, 150)">
        <circle r="25" fill="url(#coin-gradient-btc)" filter="url(#glow)" />
        <text x="0" y="5" textAnchor="middle" className="coin-text">
          ₿
        </text>
      </g>

      <g className="coin eth" transform="translate(500, 150)">
        <circle r="25" fill="url(#coin-gradient-eth)" filter="url(#glow)" />
        <text x="0" y="5" textAnchor="middle" className="coin-text">
          Ξ
        </text>
      </g>

      <g className="coin ltc" transform="translate(300, 450)">
        <circle r="25" fill="url(#coin-gradient-ltc)" filter="url(#glow)" />
        <text x="0" y="5" textAnchor="middle" className="coin-text">
          Ł
        </text>
      </g>

      {/* Data streams */}
      <path className="data-stream" d="M 200 200 C 250 220, 350 250, 400 300" />
      <path className="data-stream" d="M 600 200 C 550 220, 450 250, 400 300" />
      <path className="data-stream" d="M 200 400 C 250 380, 350 350, 400 300" />
      <path className="data-stream" d="M 600 400 C 550 380, 450 350, 400 300" />
    </svg>
  );
};

export default CryptoSVG;
