/* eslint-disable react/no-unknown-property */
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
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box } from "@react-three/drei";

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: #e94560;
  font-family: "Poppins", sans-serif;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 60px;
  color: #e94560;
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px rgba(233, 69, 96, 0.2);
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

const Chart3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e94560" />
      </Box>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#e94560"
        anchorX="center"
        anchorY="middle"
      >
        Trades
      </Text>
    </Canvas>
  );
};

export default function Trades() {
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
        setTrades(userDoc.data().trades);
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

  if (loading) {
    return <Loading>Loading your stellar trades...</Loading>;
  }

  return (
    <DashboardContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaExchangeAlt /> Your Cosmic Trades
      </Title>
      <div style={{ height: "300px", marginBottom: "2rem" }}>
        <Chart3D />
      </div>
      {trades.length === 0 ? (
        <NoTrades>You haven&apos;t made any interstellar trades yet.</NoTrades>
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
  );
}
