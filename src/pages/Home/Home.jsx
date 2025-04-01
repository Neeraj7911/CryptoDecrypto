/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "./Home.css";

export default function Component() {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [marketDirection, setMarketDirection] = useState("neutral");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (allCoin && allCoin.length > 0) {
      setDisplayCoin(allCoin.sort((a, b) => b.market_cap - a.market_cap));
      calculateMarketDirection();
    }
  }, [allCoin]);

  const calculateMarketDirection = () => {
    if (!allCoin || allCoin.length === 0) return;
    const totalChange = allCoin.reduce(
      (sum, coin) => sum + coin.price_change_percentage_24h,
      0
    );
    const avgChange = totalChange / allCoin.length;
    if (avgChange > 1) setMarketDirection("bullish");
    else if (avgChange < -1) setMarketDirection("bearish");
    else setMarketDirection("neutral");
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    filterCoins(searchValue, selectedCategory);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterCoins(searchTerm, selectedCategory);
  };

  const handleCoinClick = (coin) => {
    const potentialScam = isPotentialScam(coin);
    if (!potentialScam) {
      navigate(`/crypto/${coin.symbol}`);
    } else {
      if (selectedCoin?.symbol === coin.symbol) {
        setSelectedCoin(null);
        navigate(`/crypto/${coin.symbol}`);
      } else {
        setSelectedCoin(coin);
      }
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterCoins(searchTerm, category);
  };

  const filterCoins = (search, category) => {
    let filteredCoins = [...allCoin];

    if (search) {
      filteredCoins = filteredCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search) ||
          coin.symbol.toLowerCase().includes(search)
      );
    }

    if (category === "topMovers") {
      filteredCoins = filteredCoins
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        )
        .slice(0, 10);
    } else if (category === "topLosers") {
      filteredCoins = filteredCoins
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        )
        .slice(0, 10);
    } else {
      filteredCoins = filteredCoins.sort((a, b) => b.market_cap - a.market_cap);
    }

    setDisplayCoin(filteredCoins);
  };

  const getAction = (priceChange) => {
    if (priceChange >= 5) return "Launch";
    if (priceChange >= 0) return priceChange >= 1 ? "Boost" : "Acquire";
    if (priceChange <= -5) return "Pause";
    if (priceChange < 0) return priceChange <= -1 ? "Track" : "Scan";
    return "Acquire";
  };

  const isPotentialScam = (coin) => {
    const memeKeywords = [
      "shib",
      "doge",
      "baby",
      "moon",
      "floki",
      "safemoon",
      "elon",
      "cum",
      "pump",
      "dump",
      "pepe",
      "meme",
      "cat",
      "dog",
      "inu",
    ]; // Expanded list
    const nameLower = coin.name.toLowerCase();
    const hasMemeName = memeKeywords.some((keyword) =>
      nameLower.includes(keyword)
    );
    const extremeVolatility = Math.abs(coin.price_change_percentage_24h) > 50;
    const lowMarketCap = coin.market_cap < 1000000;
    return hasMemeName || extremeVolatility || lowMarketCap;
  };

  const getScamRisk = (coin) => {
    let risk = 0;
    const memeKeywords = [
      "shib",
      "doge",
      "baby",
      "moon",
      "floki",
      "safemoon",
      "elon",
      "cum",
      "pump",
      "dump",
      "pepe",
      "meme",
      "cat",
      "dog",
      "inu",
    ];
    const nameLower = coin.name.toLowerCase();
    if (memeKeywords.some((keyword) => nameLower.includes(keyword))) risk += 40;
    if (Math.abs(coin.price_change_percentage_24h) > 50) risk += 30;
    if (coin.market_cap < 1000000) risk += 30;
    return Math.min(risk, 100);
  };

  const tickerTapeConfig = {
    symbols: [
      { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
      { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      { description: "usdt", proName: "GEMINI:USDTUSD" },
      { description: "bnbusd", proName: "BINANCE:BNBUSD" },
    ],
    showSymbolLogo: true,
    isTransparent: true,
    displayMode: "adaptive",
    colorTheme: "dark",
    locale: "en",
  };

  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.textContent = JSON.stringify(tickerTapeConfig);
      document.getElementById("tradingview-widget").appendChild(script);
    }

    const removeElements = () => {
      const elements = document.getElementsByClassName(
        "label-dzbd7lyV label-e9c6dycV end-dzbd7lyV top-dzbd7lyV snap-dzbd7lyV js-copyright-label"
      );
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    };
    removeElements();
  }, []);

  return (
    <div className="home">
      <div className="content-container">
        <section className="command-hub">
          <h1>
            Live Crypto Market Tracker <br />
            With <br />
            <span className="typewriter">
              <Typewriter
                words={[
                  "Real-Time Insights",
                  "Market Mastery",
                  "Strategic Moves",
                  "Wealth Control",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </h1>
        </section>

        <section className="market-pulse">
          <div className={`pulse-indicator ${marketDirection}`}>
            <div className="pulse-arrow"></div>
            <h2>Market Pulse: {marketDirection.toUpperCase()}</h2>
            <p>
              {marketDirection === "bullish"
                ? "The market is surging! Time to ride the wave."
                : marketDirection === "bearish"
                ? "Caution advised: Market trending downward."
                : "Market stable: Watch for breakout opportunities."}
            </p>
          </div>
        </section>

        <section className="market-ticker">
          <div id="tradingview-widget" className="ticker-display"></div>
        </section>
        <section className="search-brr">
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search Crypto Assets..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
        </section>

        <section className="filter-panel">
          <button
            className={`filter-option ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            All Assets
          </button>
          <button
            className={`filter-option ${
              selectedCategory === "topMovers" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("topMovers")}
          >
            Top Gainers
          </button>
          <button
            className={`filter-option ${
              selectedCategory === "topLosers" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("topLosers")}
          >
            Top Losers
          </button>
        </section>

        <section className="asset-grid">
          {displayCoin.map((item, index) => {
            const potentialScam = isPotentialScam(item);
            const scamRisk = getScamRisk(item);
            const isSelected = selectedCoin?.symbol === item.symbol;
            return (
              <div
                className={`asset-card ${potentialScam ? "scam-alert" : ""} ${
                  isSelected ? "selected" : ""
                }`}
                key={index}
                onClick={() => handleCoinClick(item)}
              >
                <div className="card-header">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="asset-icon"
                  />
                  <div className="asset-details">
                    <h3>{item.symbol.toUpperCase()}</h3>
                    <span>{item.name}</span>
                  </div>
                </div>
                <div className="card-body">
                  <p>
                    Price: {currency.symbol}
                    {item.current_price.toLocaleString()}
                  </p>
                  <p
                    className={
                      item.price_change_percentage_24h >= 0 ? "green" : "red"
                    }
                  >
                    24H: {item.price_change_percentage_24h.toFixed(2)}%
                  </p>
                  <p>
                    Market Cap: {currency.symbol}
                    {item.market_cap.toLocaleString()}
                  </p>
                </div>
                {isSelected && potentialScam && (
                  <div className="scam-meter">
                    <div className="speedometer">
                      <div className="speedometer-dial">
                        <div
                          className="needle"
                          style={{
                            "--scam-risk":
                              -180 + (scamRisk / 100) * (30 - -180), // Map 0-100% to -180° to 30°
                          }}
                        ></div>
                      </div>
                      <div className="speedometer-labels">
                        <span className="label-safe">Safe</span>
                        <span className="label-risky">Risky</span>
                      </div>
                    </div>
                    <p className="scam-warning">
                      Scam Risk: {scamRisk}% - Click again to proceed
                    </p>
                  </div>
                )}
                <div className="card-footer">
                  <span
                    className={`action-${getAction(
                      item.price_change_percentage_24h
                    ).toLowerCase()}`}
                  >
                    {getAction(item.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
