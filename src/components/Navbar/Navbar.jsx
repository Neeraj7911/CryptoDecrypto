import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaStar,
  FaUser,
  FaExchangeAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChartLine,
  FaLocationArrow,
  FaBars,
} from "react-icons/fa";
import { TbBrandCoinbase } from "react-icons/tb";
import { QRCodeSVG } from "qrcode.react";
import { auth, db } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "./Navbar.css";

const DefaultAvatar = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="20" fill="#E0E0E0" />
    <path
      d="M20 21C22.7614 21 25 18.7614 25 16C25 13.2386 22.7614 11 20 11C17.2386 11 15 13.2386 15 16C15 18.7614 17.2386 21 20 21ZM20 23C16.1340 23 13 26.1340 13 30H27C27 26.1340 23.8660 23 20 23Z"
      fill="#BDBDBD"
    />
  </svg>
);

function Navbar({ openLogin, openSignup }) {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
  });
  const [upiId, setUpiId] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfilePic(currentUser);
        await fetchBalance(currentUser.uid);
        await fetchPortfolio(currentUser.uid);
      } else {
        setProfilePic(null);
        setBalance(0);
        setPortfolio([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfilePic = async (currentUser) => {
    try {
      if (currentUser.photoURL) {
        setProfilePic(currentUser.photoURL);
      } else {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().profilePic) {
          setProfilePic(userDoc.data().profilePic);
        } else {
          setProfilePic(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePic(null);
    }
  };

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

  const fetchPortfolio = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().portfolio) {
        const portfolioData = userDoc.data().portfolio;
        const portfolioArray = Object.entries(portfolioData).map(
          ([coinId, trades]) => {
            const totalQuantity = trades.reduce(
              (sum, trade) => sum + trade.quantity,
              0
            );
            const totalCost = trades.reduce(
              (sum, trade) => sum + trade.quantity * trade.purchasePrice,
              0
            );
            const averagePrice = totalCost / totalQuantity;
            return { coinId, quantity: totalQuantity, averagePrice };
          }
        );
        setPortfolio(portfolioArray);
      } else {
        setPortfolio([]);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setPortfolio([]);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleWallet = () => setIsWalletOpen(!isWalletOpen);
  const togglePortfolio = () => setIsPortfolioOpen(!isPortfolioOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      setProfilePic(null);
      setBalance(0);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const qrData = JSON.stringify({
      type: "deposit",
      amount: amount,
      userId: user.uid,
      timestamp: Date.now(),
    });
    setQrCodeData(qrData);
    setIsQrCodeVisible(true);
  };

  const handleWithdraw = async () => {
    if (user) {
      try {
        const withdrawAmount = parseFloat(transactionAmount);
        if (
          !isNaN(withdrawAmount) &&
          withdrawAmount > 0 &&
          withdrawAmount <= balance
        ) {
          const newBalance = balance - withdrawAmount;
          await updateDoc(doc(db, "users", user.uid), { balance: newBalance });
          setBalance(newBalance);
          setTransactionAmount("");
          alert("Withdrawal successful!");
        } else {
          alert("Invalid withdrawal amount");
        }
      } catch (error) {
        console.error("Error processing withdrawal:", error);
        alert("Error processing withdrawal");
      }
    }
  };

  const handleTransaction = () => {
    if (transactionType === "deposit") {
      handleDeposit();
    } else {
      handleWithdraw();
    }
  };

  const verifyDeposit = async () => {
    const depositData = JSON.parse(qrCodeData);
    const amount = depositData.amount;

    try {
      const newBalance = balance + amount;
      await updateDoc(doc(db, "users", user.uid), { balance: newBalance });
      setBalance(newBalance);
      setTransactionAmount("");
      setIsQrCodeVisible(false);
      alert("Deposit verified and added to your wallet!");
    } catch (error) {
      console.error("Error verifying deposit:", error);
      alert("Error verifying deposit");
    }
  };

  const handleCloseModal = () => {
    setIsWalletOpen(false);
    setIsPortfolioOpen(false);
    setIsQrCodeVisible(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <TbBrandCoinbase className="logo-icon" aria-hidden="true" />
          <span className="logo-text">CryptoDecrypto</span>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={toggleMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" onClick={toggleMobileMenu}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/HeatMaps" onClick={toggleMobileMenu}>
                HeatMaps
              </Link>
            </li>
            <li>
              <Link to="/news" onClick={toggleMobileMenu}>
                News
              </Link>
            </li>
          </ul>
          {!user && (
            <div className="auth-buttons mobile">
              <button
                onClick={() => {
                  openLogin();
                  toggleMobileMenu();
                }}
                className="login-btn"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  openSignup();
                  toggleMobileMenu();
                }}
                className="signup-btn"
              >
                Get Started <FaLocationArrow style={{ marginLeft: "5px" }} />
              </button>
            </div>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <button className="wallet-btn" onClick={toggleWallet}>
                <FaWallet aria-hidden="true" /> ${balance.toFixed(2)}
              </button>
              <Link
                to="/Wishlist"
                className="wishlist-icon"
                aria-label="Wishlist"
              >
                <FaStar aria-hidden="true" />
              </Link>
              <div className="profile-container">
                <button
                  className="profile-btn"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="profile-pic"
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="profile-dropdown" role="menu">
                    <Link
                      to="/profile-settings"
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <FaUser aria-hidden="true" /> Profile Settings
                    </Link>
                    <Link
                      to="/trades"
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <FaExchangeAlt aria-hidden="true" /> Trades
                    </Link>
                    <Link
                      onClick={togglePortfolio}
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <FaChartLine aria-hidden="true" /> Portfolio
                    </Link>
                    <Link
                      to="/support"
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <FaQuestionCircle aria-hidden="true" /> Help and Support
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                      role="menuitem"
                    >
                      <FaSignOutAlt aria-hidden="true" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons desktop">
              <button onClick={openLogin} className="login-btn">
                Log In
              </button>
              <button onClick={openSignup} className="signup-btn">
                Get Started <FaLocationArrow style={{ marginLeft: "5px" }} />
              </button>
            </div>
          )}
        </div>
        <button
          className="menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
      </div>

      {isWalletOpen && (
        <div className="modal-overlay">
          <div
            className="modal wallet-modal"
            role="dialog"
            aria-labelledby="wallet-title"
          >
            <div className="modal-content">
              <button
                onClick={handleCloseModal}
                className="close-btn"
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 id="wallet-title">Wallet</h2>
              <div className="wallet-balance">
                <FaWallet aria-hidden="true" /> Current Balance: $
                {balance.toFixed(2)}
              </div>
              <div className="wallet-actions">
                <div className="transaction-type">
                  <label>
                    <input
                      type="radio"
                      value="deposit"
                      checked={transactionType === "deposit"}
                      onChange={() => setTransactionType("deposit")}
                    />
                    Deposit
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="withdraw"
                      checked={transactionType === "withdraw"}
                      onChange={() => setTransactionType("withdraw")}
                    />
                    Withdraw
                  </label>
                </div>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder={`Enter ${transactionType} amount`}
                  aria-label={`Enter ${transactionType} amount`}
                />
                {transactionType === "withdraw" && (
                  <div className="withdraw-method">
                    <label>
                      <input
                        type="radio"
                        value="bank"
                        checked={withdrawMethod === "bank"}
                        onChange={() => setWithdrawMethod("bank")}
                      />
                      Bank Transfer
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="upi"
                        checked={withdrawMethod === "upi"}
                        onChange={() => setWithdrawMethod("upi")}
                      />
                      UPI
                    </label>
                  </div>
                )}
                {transactionType === "withdraw" &&
                  withdrawMethod === "bank" && (
                    <div className="bank-details">
                      <div className="accno">
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Account Number"
                          aria-label="Account Number"
                        />
                      </div>
                      <div className="ifscc">
                        <input
                          type="text"
                          value={bankDetails.ifscCode}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              ifscCode: e.target.value,
                            })
                          }
                          placeholder="IFSC Code"
                          aria-label="IFSC Code"
                        />
                      </div>
                    </div>
                  )}
                {transactionType === "withdraw" && withdrawMethod === "upi" && (
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="UPI ID"
                    aria-label="UPI ID"
                  />
                )}
                <button onClick={handleTransaction}>
                  {transactionType === "deposit" ? "Add Now" : "Withdraw"}
                </button>
              </div>
              {isQrCodeVisible && (
                <div className="qr-code-section">
                  <h3>Scan QR Code to Deposit</h3>
                  <QRCodeSVG value={qrCodeData} size={256} />
                  <button onClick={verifyDeposit}>Verify Deposit</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isPortfolioOpen && (
        <div className="modal-overlay">
          <div
            className="modal portfolio-modal"
            role="dialog"
            aria-labelledby="portfolio-title"
          >
            <div className="modal-content">
              <button
                onClick={handleCloseModal}
                className="close-btn"
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 id="portfolio-title">Your Crypto Portfolio</h2>
              <div className="portfolio-list">
                <div className="portfolio-item portfolio-header">
                  <span className="coin-id">Coin</span>
                  <span className="coin-quantity">Quantity</span>
                  <span className="coin-avg-price">Avg. Price</span>
                  <span className="coin-status">Status</span>
                </div>
                {portfolio.map((coin) => (
                  <div key={coin.coinId} className="portfolio-item">
                    <span className="coin-id">{coin.coinId.toUpperCase()}</span>
                    <span className="coin-quantity">
                      {coin.quantity.toFixed(8)}
                    </span>
                    <span className="coin-avg-price">
                      ${coin.averagePrice.toFixed(2)}
                    </span>
                    <span className={`coin-status ${getCoinStatus(coin)}`}>
                      {getCoinStatus(coin) === "profit" ? "Profit" : "Loss"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function getCoinStatus(coin) {
  // This function should compare the current price with the average price
  // For demonstration purposes, we'll use a random boolean
  return Math.random() > 0.5 ? "profit" : "loss";
}

export default Navbar;
