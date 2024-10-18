/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebaseConfig";
import { FaTrash } from "react-icons/fa";
import "./WishlistPage.css";

const TradingViewWidget = ({ symbol }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [["BINANCE:" + symbol + "USDT|1D"]],
      chartOnly: false,
      width: "100%",
      height: 500,
      locale: "en",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
    });

    const container = document.getElementById(`tradingview-widget-${symbol}`);
    container.appendChild(script);

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container-1">
      <div id={`tradingview-widget-${symbol}`}></div>
    </div>
  );
};

const WishlistPage = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeWishlist = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const wishlistItems = userData.wishlist || [];
              console.log("Fetched wishlist from Firebase:", wishlistItems);
              setWishlist(wishlistItems);
            } else {
              console.log("User document does not exist");
              setWishlist([]);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching user document:", err);
            setError("Failed to fetch user data. Please try again later.");
            setLoading(false);
          }
        );

        return () => unsubscribeWishlist();
      } else {
        setWishlist([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFromWishlist = async (symbol) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedWishlist = userData.wishlist.filter(
          (item) => item !== symbol
        );
        await updateDoc(userDocRef, { wishlist: updatedWishlist });
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return (
      <div className="login-prompt">
        <h1>Please log in to view your wishlist</h1>
        <Link to="/login" className="login-button">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="empty-wishlist">
          Your wishlist is empty. Add some coins to track!
        </p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((symbol) => (
            <div key={symbol} className="coin-card">
              <div className="coin-header">
                <Link to={`/crypto/${symbol}`}>
                  <h2 className="coin-name">{symbol}</h2>
                </Link>

                <button
                  onClick={() => removeFromWishlist(symbol)}
                  className="remove-button"
                >
                  <FaTrash />
                </button>
              </div>
              <TradingViewWidget symbol={symbol} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
