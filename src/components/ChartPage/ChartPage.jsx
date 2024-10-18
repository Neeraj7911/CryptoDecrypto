/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Firebase/firebaseConfig";
import { FaStar, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { CoinContext } from "../../context/CoinContext";
import "./ChartPage.css";

const WishlistButton = ({ coinId }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().wishlist) {
          setIsWishlisted(userDoc.data().wishlist.includes(coinId));
        }
      }
    });

    return () => unsubscribe();
  }, [coinId]);

  const toggleWishlist = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      if (isWishlisted) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(coinId),
        });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(coinId),
        });
      }
      setIsWishlisted(!isWishlisted);
    } else {
      alert("Please log in to add to wishlist");
    }
  };

  return (
    <button onClick={toggleWishlist} className="wishlist-button">
      <FaStar color={isWishlisted ? "#ffb74d" : "white"} />
      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
};

const TradingViewChart = ({ coin }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== "undefined") {
        new TradingView.widget({
          autosize: true,
          symbol: `BITSTAMP:${coin.toUpperCase()}USD`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview-chart",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [coin]);

  return <div id="tradingview-chart" className="tradingview-chart"></div>;
};

const TradingViewWidget = ({ activeTab, coin }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const script = document.createElement("script");
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${getWidgetType(
      activeTab
    )}.js`;
    script.async = true;
    script.innerHTML = JSON.stringify(getWidgetConfig(activeTab, coin));

    const container = document.getElementById("widget-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [activeTab, coin]);

  return (
    <div className="widget-wrapper">
      {isLoading && <div className="loading-spinner">Loading...</div>}
      <div
        id="widget-container"
        className={`widget-container ${isLoading ? "loading" : "loaded"}`}
      ></div>
    </div>
  );
};

const getWidgetType = (activeTab) => {
  switch (activeTab) {
    case "overview":
      return "symbol-info";
    case "analysis":
      return "technical-analysis";
    case "fundamentals":
      return "financials";
    case "profile":
      return "symbol-profile";
    default:
      return "symbol-info";
  }
};

const getWidgetConfig = (activeTab, coin) => {
  const symbol = `BITSTAMP:${coin.toUpperCase()}USD`;
  const baseConfig = {
    width: "100%",
    height: 450,
    colorTheme: "dark",
    isTransparent: false,
    locale: "en",
    symbol: symbol,
  };

  switch (activeTab) {
    case "overview":
      return { ...baseConfig };
    case "analysis":
      return {
        ...baseConfig,
        interval: "1m",
        showIntervalTabs: true,
      };
    case "fundamentals":
      return {
        ...baseConfig,
        height: 550,
      };
    case "profile":
      return {
        ...baseConfig,
        height: 550,
      };
    default:
      return baseConfig;
  }
};

const TransactionModal = ({
  isOpen,
  onClose,
  type,
  coinId,
  currentPrice,
  balance,
  onTransaction,
}) => {
  const [quantity, setQuantity] = useState("");

  const handleTransaction = () => {
    const amount = parseFloat(quantity);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    onTransaction(type, amount, currentPrice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>
          {type.charAt(0).toUpperCase() + type.slice(1)} {coinId.toUpperCase()}
        </h2>
        <p>Current Price: ${currentPrice.toFixed(2)}</p>
        <p>Your Balance: ${balance.toFixed(2)}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="quantity-input"
        />
        <button onClick={handleTransaction} className={`${type}-button`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>
    </div>
  );
};

export default function Component() {
  const { id } = useParams();
  const { allCoin, currency } = useContext(CoinContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentCoin, setCurrentCoin] = useState(null);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");

  const fetchCoinData = useCallback(() => {
    const coin = allCoin.find((c) => c.id === id || c.symbol === id);
    if (coin) {
      setCurrentCoin(coin);
    } else {
      console.error("Coin not found");
    }
  }, [id, allCoin]);

  useEffect(() => {
    fetchCoinData();
    const interval = setInterval(fetchCoinData, 10000);
    return () => clearInterval(interval);
  }, [fetchCoinData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchBalance(currentUser.uid);
      } else {
        setBalance(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBalance = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().balance !== undefined) {
        setBalance(userDoc.data().balance);
      } else {
        await setDoc(doc(db, "users", uid), { balance: 0 }, { merge: true });
        setBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    }
  };

  const handleTransaction = async (type, amount, price) => {
    if (!user) {
      alert("Please log in to make transactions");
      return;
    }

    const totalCost = amount * price;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      let newBalance = balance;
      let portfolioUpdate = {};

      if (type === "buy") {
        if (totalCost > balance) {
          alert("Insufficient balance");
          return;
        }
        newBalance -= totalCost;
        portfolioUpdate = {
          [`portfolio.${id}`]: arrayUnion({
            quantity: amount,
            purchasePrice: price,
            date: new Date().toISOString(),
          }),
        };
      } else if (type === "sell") {
        const ownedQuantity =
          userData.portfolio?.[id]?.reduce(
            (total, trade) => total + trade.quantity,
            0
          ) || 0;
        if (amount > ownedQuantity) {
          alert(`You don't have enough ${id} to sell`);
          return;
        }
        newBalance += totalCost;
        portfolioUpdate = {
          [`portfolio.${id}`]: arrayUnion({
            quantity: -amount,
            sellPrice: price,
            date: new Date().toISOString(),
          }),
        };
      }

      await updateDoc(userRef, {
        balance: newBalance,
        ...portfolioUpdate,
        trades: arrayUnion({
          type,
          coin: id,
          quantity: amount,
          price,
          total: totalCost,
          date: new Date().toISOString(),
        }),
      });

      setBalance(newBalance);
      alert(
        `Successfully ${type === "buy" ? "bought" : "sold"} ${amount} ${id}`
      );
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("An error occurred while processing the transaction");
    }
  };

  return (
    <div className="chart-page">
      <div className="chart-header">
        <h1 className="title">Real-Time Chart for {id.toUpperCase()}</h1>
        <WishlistButton coinId={id} />
      </div>
      <div className="chart-container">
        <TradingViewChart coin={id} />
      </div>
      <div className="price-display">
        <span>Current Price: </span>
        {currentCoin ? (
          <>
            <span className="price">
              {currency.symbol} {currentCoin.current_price.toLocaleString()}
            </span>
            <span
              className={
                currentCoin.price_change_percentage_24h > 0 ? "green" : "red"
              }
            >
              {currentCoin.price_change_percentage_24h.toFixed(2)}%
            </span>
            {currentCoin.price_change_percentage_24h > 0 ? (
              <FaArrowUp className="price-arrow up" />
            ) : (
              <FaArrowDown className="price-arrow down" />
            )}
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <div className="transaction-buttons">
        <button
          onClick={() => {
            setTransactionType("buy");
            setIsTransactionModalOpen(true);
          }}
          className="buy-button"
        >
          Buy
        </button>
        <button
          onClick={() => {
            setTransactionType("sell");
            setIsTransactionModalOpen(true);
          }}
          className="sell-button"
        >
          Sell
        </button>
      </div>
      <div className="widget-section">
        <nav className="nav-bar">
          <button onClick={() => setActiveTab("overview")}>
            Coin Overview
          </button>
          <button onClick={() => setActiveTab("analysis")}>
            Technical Analysis
          </button>
          <button onClick={() => setActiveTab("fundamentals")}>
            Fundamental Data
          </button>
          <button onClick={() => setActiveTab("profile")}>Coin Profile</button>
        </nav>
        <TradingViewWidget activeTab={activeTab} coin={id} />
      </div>
      {currentCoin && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          type={transactionType}
          coinId={id}
          currentPrice={currentCoin.current_price}
          balance={balance}
          onTransaction={handleTransaction}
        />
      )}
    </div>
  );
}
