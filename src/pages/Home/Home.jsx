/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useRef } from "react";
import { CoinContext } from "../../context/CoinContext";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "./Home.css";

export default function Component() {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const cryptoTableRef = useRef(null);

  useEffect(() => {
    setDisplayCoin(allCoin.sort((a, b) => b.market_cap - a.market_cap));
  }, [allCoin]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${
          scrollPosition * 0.5
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    filterCoins(searchValue, selectedCategory);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleCoinClick = (id) => {
    navigate(`/crypto/${id}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterCoins(searchTerm, category);
  };

  const filterCoins = (search, category) => {
    let filteredCoins = allCoin;

    if (search) {
      filteredCoins = filteredCoins.filter((coin) =>
        coin.name.toLowerCase().includes(search)
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
    }

    setDisplayCoin(filteredCoins.sort((a, b) => b.market_cap - a.market_cap));
  };

  const tickerTapeConfig = {
    symbols: [
      { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
      { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      { description: "usdt", proName: "GEMINI:USDTUSD" },
      { description: "bnbusd", proName: "BINANCE:BNBUSD" },
    ],
    showSymbolLogo: true,
    isTransparent: false,
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

  const renderCoinCard = (coin) => (
    <div
      key={coin.id}
      className="mover-card"
      onClick={() => handleCoinClick(coin.symbol)}
    >
      <img src={coin.image} alt={coin.name} />
      <h3>{coin.symbol.toUpperCase()}</h3>
      <p className={coin.price_change_percentage_24h > 0 ? "green" : "red"}>
        {coin.price_change_percentage_24h.toFixed(2)}%
      </p>
    </div>
  );

  return (
    <div className="home">
      <div className="parallax-bg" ref={parallaxRef}></div>
      <div className="content">
        <div className="hero">
          <h1>
            Live Crypto Market Tracker <br /> With <br />
            <Typewriter
              words={[
                "AI Recommendation",
                "Analyzed Patterns",
                "Advanced Analytics",
                "Real-Time Insights",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>

          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search Coin"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="Ticker">
          <div className="tradingview-widget-container">
            <div
              id="tradingview-widget"
              className="tradingview-widget-container__widget"
            ></div>
          </div>
        </div>

        <div className="category-selector">
          <button
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => handleCategoryChange("all")}
          >
            All Coins
          </button>
          <button
            className={selectedCategory === "topMovers" ? "active" : ""}
            onClick={() => handleCategoryChange("topMovers")}
          >
            Top Movers
          </button>
          <button
            className={selectedCategory === "topLosers" ? "active" : ""}
            onClick={() => handleCategoryChange("topLosers")}
          >
            Top Losers
          </button>
        </div>

        <div className="crypto-table" ref={cryptoTableRef}>
          <div className="table-layout table-header">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p>24H Change</p>
            <p>Market Cap</p>
            <p>Buy Recommendation</p>
          </div>

          {displayCoin.map((item, index) => (
            <div
              className="table-layout"
              key={index}
              onClick={() => handleCoinClick(item.symbol)}
            >
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt={item.name} className="coin-image" />
                <p>{item.name + " (" + item.symbol.toUpperCase() + ")"}</p>
              </div>
              <p>
                {currency.symbol} {item.current_price.toLocaleString()}
              </p>
              <p
                className={
                  item.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {item.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p>
                {currency.symbol}
                {item.market_cap.toLocaleString()}
              </p>
              <p className="buy-recommendation">
                {item.price_change_percentage_24h > 0 ? "Buy" : "Hold"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
