/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./HeatMaps.css";

export default function CoinGeckoHeatmap() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.coingecko.com/gecko-coin-heatmap-widget.js";
    script.async = true;

    script.onload = () => console.log("CoinGecko widget loaded successfully");
    script.onerror = () => console.error("Error loading CoinGecko widget");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="heatmap-page">
      <div className="heatmap-header">
        <h1>Crypto Market Heatmap</h1>
        <p>Visualize the cryptocurrency market at a glance</p>
      </div>
      <div className="heatmap-container">
        {/* Use the CoinGecko heatmap widget directly */}
        <gecko-coin-heatmap-widget
          locale="en"
          transparent-background="true"
          top="100"
        ></gecko-coin-heatmap-widget>
      </div>
      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="color-box green"></div>
          <span>Positive Change</span>
        </div>
        <div className="legend-item">
          <div className="color-box red"></div>
          <span>Negative Change</span>
        </div>
        <div className="legend-item">
          <div className="color-box neutral"></div>
          <span>No Significant Change</span>
        </div>
      </div>
    </div>
  );
}
