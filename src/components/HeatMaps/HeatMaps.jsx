/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./HeatMaps.css";

export default function CoinGeckoHeatmap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState("all"); // Filter for legend interaction

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.coingecko.com/gecko-coin-heatmap-widget.js";
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      console.log("CoinGecko widget loaded successfully");
    };
    script.onerror = () => console.error("Error loading CoinGecko widget");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFilterChange = (type) => {
    setFilter(type);
    // Note: Actual heatmap filtering would require CoinGecko widget API support,
    // which isn't available. This is a UI enhancement only.
  };

  return (
    <div className="heatmap-page">
      <div className="heatmap-backdrop"></div>
      <div className="heatmap-header">
        <h1>Crypto Market Heatmap</h1>
        <p>Scan the market pulse in real-time</p>
      </div>
      <div className="heatmap-container">
        {!isLoaded ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Initializing Heatmap...</p>
          </div>
        ) : (
          <gecko-coin-heatmap-widget
            locale="en"
            transparent-background="true"
            top="100"
            className={`heatmap-widget ${
              filter !== "all" ? `filter-${filter}` : ""
            }`}
          ></gecko-coin-heatmap-widget>
        )}
        <div className="heatmap-overlay"></div>
      </div>
      <div className="heatmap-legend">
        <button
          className={`legend-item ${filter === "positive" ? "active" : ""}`}
          onClick={() =>
            handleFilterChange(filter === "positive" ? "all" : "positive")
          }
        >
          <div className="color-box green"></div>
          <span>Positive Surge</span>
        </button>
        <button
          className={`legend-item ${filter === "negative" ? "active" : ""}`}
          onClick={() =>
            handleFilterChange(filter === "negative" ? "all" : "negative")
          }
        >
          <div className="color-box red"></div>
          <span>Negative Drift</span>
        </button>
        <button
          className={`legend-item ${filter === "neutral" ? "active" : ""}`}
          onClick={() =>
            handleFilterChange(filter === "neutral" ? "all" : "neutral")
          }
        >
          <div className="color-box neutral"></div>
          <span>Stable Orbit</span>
        </button>
      </div>
    </div>
  );
}
