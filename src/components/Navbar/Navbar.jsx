/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLocationArrow,
  FaBars,
  FaTimes,
  FaUser,
  FaCog,
  FaExchangeAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaStar,
  FaWallet,
  FaMoneyBillWave,
  FaQrcode,
  FaChartLine,
} from "react-icons/fa";
import { TbBrandCoinbase } from "react-icons/tb";
import { QRCodeSVG } from "qrcode.react";
import { auth, db } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const DefaultAvatar = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#E0E0E0" />
    <path
      d="M20 21C22.7614 21 25 18.7614 25 16C25 13.2386 22.7614 11 20 11C17.2386 11 15 13.2386 15 16C15 18.7614 17.2386 21 20 21ZM20 23C16.1340 23 13 26.1340 13 30H27C27 26.1340 23.8660 23 20 23Z"
      fill="#BDBDBD"
    />
  </svg>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleWallet = () => setIsWalletOpen(!isWalletOpen);
  const togglePortfolio = () => setIsPortfolioOpen(!isPortfolioOpen);

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

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="logo">
            <TbBrandCoinbase className="logo-icon" />
            <span className="logo-text">CryptoDecrypto</span>
          </Link>

          <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" onClick={toggleMenu}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/HeatMaps" onClick={toggleMenu}>
                  HeatMaps
                </Link>
              </li>
              <li>
                <Link to="/news" onClick={toggleMenu}>
                  News
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-right">
            {user ? (
              <>
                <button className="wallet-btn" onClick={toggleWallet}>
                  <FaWallet /> ${balance.toFixed(2)}
                </button>
                <Link to="/Wishlist" className="wishlist-icon">
                  <FaStar />
                </Link>
                <div className="profile-container">
                  <button className="profile-btn" onClick={toggleDropdown}>
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
                    <div className="profile-dropdown">
                      <Link to="/profile-settings" className="dropdown-item">
                        <FaUser /> Profile Settings
                      </Link>
                      <Link to="/trades" className="dropdown-item">
                        <FaExchangeAlt /> Trades
                      </Link>
                      <button
                        style={{
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "white",
                          fontSize: "16px",
                        }}
                        onClick={togglePortfolio}
                        className="dropdown-item"
                      >
                        <FaChartLine /> Portfolio
                      </button>
                      <Link to="/support" className="dropdown-item">
                        <FaQuestionCircle /> Help and Support
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout-btn"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={openLogin} className="login-btn">
                  Log In
                </button>
                <button onClick={openSignup} className="signup-btn">
                  Get Started <FaLocationArrow />
                </button>
              </>
            )}
            <div className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </nav>

      {isWalletOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Wallet</h2>
            <div className="wallet-balance">
              <FaWallet /> Current Balance: ${balance.toFixed(2)}
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
              {transactionType === "withdraw" && withdrawMethod === "bank" && (
                <div className="bank-details">
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
                  />
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
                  />
                </div>
              )}
              {transactionType === "withdraw" && withdrawMethod === "upi" && (
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="UPI ID"
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
            <button onClick={toggleWallet} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {isPortfolioOpen && (
        <div className="modal-overlay">
          <div className="modal portfolio-modal">
            <h2>Your Crypto Portfolio</h2>
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
            <button onClick={togglePortfolio} className="close-btn">
              Close Portfolio
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .navbar.scrolled .navbar-container {
          padding: 0.5rem 2rem;
          background: rgba(0, 0, 0, 0.8);
        }
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .logo-icon {
          font-size: 2rem;
          margin-right: 0.5rem;
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .nav-links ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links li {
          margin: 0 1rem;
        }
        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-links a::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #f1c40f;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-links a:hover::after {
          transform: scaleX(1);
        }
        .nav-right {
          display: flex;
          align-items: center;
        }
        .login-btn,
        .signup-btn,
        .wallet-btn {
          background-color: transparent;
          color: #fff;
          border: 1px solid #f1c40f;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 1rem;
        }
        .signup-btn {
          background-color: #f1c40f;
          color: #000;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .wallet-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .login-btn:hover,
        .signup-btn:hover,
        .wallet-btn:hover {
          background-color: #e2b607;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .menu-toggle {
          display: none;
          font-size: 1.5rem;
          color: #fff;
          cursor: pointer;
        }
        .wishlist-icon {
          color: #f1c40f;
          font-size: 1.5rem;
          margin-left: 1rem;
          transition: all 0.3s ease;
        }
        .wishlist-icon:hover {
          transform: scale(1.1);
        }
        .profile-container {
          position: relative;
          margin-left: 1rem;
        }
        .profile-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 50%;
        }
        .profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 2px solid #f1c40f;
          border-radius: 50%;
        }
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 0.5rem 0;
          min-width: 200px;
          z-index: 1001;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          color: #333;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        .dropdown-item svg {
          margin-right: 0.5rem;
        }
        .logout-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #e74c3c;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 500px;
          color: black;
        }
        .modal h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #f1c40f;
          font-size: 1.8rem;
          border-bottom: 2px solid #f1c40f;
          padding-bottom: 0.5rem;
        }
        .wallet-balance {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .wallet-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .transaction-type,
        .withdraw-method {
          display: flex;
          justify-content: space-around;
          margin-bottom: 1rem;
        }
        .modal input[type="number"],
        .modal input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal button {
          background-color: #f1c40f;
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.5rem;
          width: 100%;
        }
        .modal button:hover {
          background-color: #e2b607;
        }
        .close-btn {
          margin-top: 1.5rem;
          background-color: #f1c40f !important;
          color: #1a1a1a !important;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .close-btn:hover {
          background-color: #f39c12 !important;
          transform: translateY(-2px);
        }
        .qr-code-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1rem;
        }
        .qr-code-section h3 {
          margin-bottom: 1rem;
        }
        .portfolio-modal {
          max-width: 600px;
          background-color: #1a1a1a;
          color: #ffffff;
          border-radius: 12px;
          padding: 2rem;
        }
        .portfolio-modal h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #f1c40f;
          border-bottom: 2px solid #f1c40f;
          padding-bottom: 0.5rem;
        }
        .portfolio-list {
          margin-top: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .portfolio-list::-webkit-scrollbar {
          width: 8px;
        }
        .portfolio-list::-webkit-scrollbar-track {
          background: #2c2c2c;
          border-radius: 4px;
        }
        .portfolio-list::-webkit-scrollbar-thumb {
          background: #f1c40f;
          border-radius: 4px;
        }
        .portfolio-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #333;
          transition: background-color 0.3s ease;
        }
        .portfolio-item:hover {
          background-color: #2c2c2c;
        }
        .coin-id {
          font-weight: bold;
          font-size: 1.1rem;
          color: #f1c40f;
        }
        .coin-quantity,
        .coin-avg-price {
          color: #bbb;
        }
        .coin-status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .coin-status.profit {
          background-color: #2ecc71;
          color: #fff;
        }
        .coin-status.loss {
          background-color: #e74c3c;
          color: #fff;
        }
        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: all 0.5s ease;
          }
          .nav-links.open {
            left: 0;
          }
          .nav-links ul {
            flex-direction: column;
            align-items: center;
          }
          .nav-links li {
            margin: 1rem 0;
          }
          .menu-toggle {
            display: block;
            margin-left: 1rem;
          }
          .login-btn,
          .signup-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

function getCoinStatus(coin) {
  // This function should compare the current price with the average price
  // For demonstration purposes, we'll use a random boolean
  return Math.random() > 0.5 ? "profit" : "loss";
}
