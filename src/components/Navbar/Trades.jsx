/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebaseConfig";
import {
  FaExchangeAlt,
  FaBitcoin,
  FaEthereum,
  FaDollarSign,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled, { createGlobalStyle, keyframes } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 60px;
  background: linear-gradient(to right, #e94560, #0f3460);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TradesList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TradeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(233, 69, 96, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 12px 48px rgba(233, 69, 96, 0.3);

    &:before {
      opacity: 1;
      animation: ${shimmer} 1.5s infinite;
    }
  }
`;

const TradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TradeType = styled.span`
  font-weight: bold;
  color: ${(props) => (props.type === "buy" ? "#4caf50" : "#f44336")};
`;

const TradeInfo = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const TradeInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CoinIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const NoTrades = styled.p`
  text-align: center;
  font-style: italic;
  color: #888;
  font-size: 1.2rem;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: #e94560;
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(233, 69, 96, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(233, 69, 96, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(233, 69, 96, 0);
  }
`;

const PulseButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    background-color: #d63851;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function EnhancedTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchTrades(user.uid);
      } else {
        setTrades([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchTrades = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().trades) {
        const fetchedTrades = userDoc.data().trades;
        // Sort trades from newest to oldest
        const sortedTrades = fetchedTrades.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTrades(sortedTrades);
      } else {
        setTrades([]);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      setTrades([]);
    }
  };

  const getCoinIcon = (coin) => {
    switch (coin.toLowerCase()) {
      case "bitcoin":
        return <FaBitcoin />;
      case "ethereum":
        return <FaEthereum />;
      default:
        return <FaDollarSign />;
    }
  };

  const refreshTrades = () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      fetchTrades(user.uid);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading>Loading your stellar trades...</Loading>;
  }

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaExchangeAlt /> Your Cosmic Trades
        </Title>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <PulseButton onClick={refreshTrades}>Refresh Trades</PulseButton>
        </div>
        {trades.length === 0 ? (
          <NoTrades>
            You haven&apos;t made any interstellar trades yet.
          </NoTrades>
        ) : (
          <TradesList>
            <AnimatePresence>
              {trades.map((trade, index) => (
                <TradeCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TradeHeader>
                    <TradeType type={trade.type}>
                      {trade.type.toUpperCase()}
                    </TradeType>
                    <CoinIcon>{getCoinIcon(trade.coin)}</CoinIcon>
                  </TradeHeader>
                  <TradeInfo>
                    <TradeInfoItem>
                      <span>Coin:</span>
                      <span>{trade.coin.toUpperCase()}</span>
                    </TradeInfoItem>
                    <TradeInfoItem>
                      <span>Quantity:</span>
                      <span>{trade.quantity}</span>
                    </TradeInfoItem>
                    <TradeInfoItem>
                      <span>Price:</span>
                      <span>${trade.price.toFixed(2)}</span>
                    </TradeInfoItem>
                    <TradeInfoItem>
                      <span>Total:</span>
                      <span>${trade.total.toFixed(2)}</span>
                    </TradeInfoItem>
                    <TradeInfoItem>
                      <span>Date:</span>
                      <span>{new Date(trade.date).toLocaleString()}</span>
                    </TradeInfoItem>
                  </TradeInfo>
                </TradeCard>
              ))}
            </AnimatePresence>
          </TradesList>
        )}
      </DashboardContainer>
    </>
  );
}
