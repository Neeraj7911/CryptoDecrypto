/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({ coin }) {
  const container = useRef();

  useEffect(() => {
    // Clear previous chart if exists
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "610",
      symbol: `BINANCE:${coin.toUpperCase()}USDT`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    // Append the script to the container
    container.current.appendChild(script);

    // Cleanup function to remove the script when the component unmounts or updates
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [coin]); // This re-runs whenever 'coin' changes

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
