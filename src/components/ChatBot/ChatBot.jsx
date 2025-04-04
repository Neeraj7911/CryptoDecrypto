import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Send, X, MessageSquare } from "lucide-react";
import { auth, db } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { OpenAI } from "openai";
import axios from "axios"; // Add axios for CoinGecko API
import "./ChatBot.css";

const RobotSVG = () => (
  <svg
    width="60"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="robot-svg"
  >
    <path
      d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V10H20C21.1 10 22 10.9 22 12V16C22 17.1 21.1 18 20 18H18V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V18H4C2.9 18 2 17.1 2 16V12C2 10.9 2.9 10 4 10H6V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2ZM12 4C11.45 4 11 4.45 11 5V6H13V5C13 4.45 12.55 4 12 4ZM8 8V10H16V8H8ZM4 12V16H6V12H4ZM18 12V16H20V12H18ZM8 18V20H16V18H8Z"
      fill="#3498db"
    />
    <circle cx="9" cy="13" r="1" fill="#e74c3c" />
    <circle cx="15" cy="13" r="1" fill="#e74c3c" />
    <path
      d="M12 14C13.1 14 14 14.9 14 16H10C10 14.9 10.9 14 12 14Z"
      fill="#f39c12"
    />
  </svg>
);

// Initialize OpenAI client
const client = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: import.meta.env.VITE_AIML_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [robotRecommendation, setRobotRecommendation] = useState(null);
  const [robotAppearCount, setRobotAppearCount] = useState(0);
  const [wishlistedCoins, setWishlistedCoins] = useState([]);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().wishlist) {
          setWishlistedCoins(userDoc.data().wishlist);
        } else {
          setWishlistedCoins([]);
        }
      } else {
        setWishlistedCoins([]);
      }
      setRobotAppearCount(0);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && isLoggedIn) {
      setMessages([
        {
          id: Date.now(),
          text: "Greetings, crypto traveler! How can I assist you today?",
          isAi: true,
        },
      ]);
    }
    scrollToBottom();
  }, [isOpen, isLoggedIn]);

  useEffect(() => {
    if (isOpen || !isLoggedIn) {
      setRobotRecommendation(null);
      return;
    }

    const actions = ["Buy", "Hold", "Sell"];
    const reasons = [
      "Market signals predict a surge!",
      "Stable trends suggest holding!",
      "Potential dip ahead, consider selling!",
      "Volatility indicates a breakout!",
      "Sentiment is shifting, act now!",
    ];

    const showRobotRecommendation = (customText = null) => {
      if (customText) {
        setRobotRecommendation({ text: customText, id: Date.now() });
      } else {
        const coin =
          wishlistedCoins.length > 0
            ? wishlistedCoins[
                Math.floor(Math.random() * wishlistedCoins.length)
              ]
            : "bitcoin";
        const action = actions[Math.floor(Math.random() * actions.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        setRobotRecommendation({
          text: `CryptoBot 3000 predicts: **${action} ${coin.toUpperCase()}** - ${reason}`,
          id: Date.now(),
        });
      }

      setTimeout(() => {
        setRobotRecommendation(null);
        if (!customText) setRobotAppearCount((prev) => prev + 1);
      }, 3000);
    };

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const isCoinPage = pathSegments[0] === "coins" && pathSegments.length === 2;
    if (isCoinPage) {
      const coinName = pathSegments[1];
      setTimeout(() => {
        showRobotRecommendation(
          `CryptoBot 3000 predicts: Need a detailed prediction for **${coinName.toUpperCase()}**? Open the chat!`
        );
      }, 1000);
    }

    if (robotAppearCount < 4) {
      const interval = setInterval(() => {
        if (robotAppearCount < 4) {
          showRobotRecommendation();
        }
      }, 20000);

      showRobotRecommendation();

      return () => clearInterval(interval);
    }
  }, [
    isOpen,
    isLoggedIn,
    robotAppearCount,
    location.pathname,
    wishlistedCoins,
  ]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !isLoggedIn) return;

    const userMessage = { id: Date.now(), text: inputMessage, isAi: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Fetch real-time crypto prices from CoinGecko
      const cryptoResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,dogecoin&vs_currencies=usd"
      );
      const currentDateTime = new Date().toLocaleString();
      const contextData = {
        prices: cryptoResponse.data,
        currentDateTime: currentDateTime,
      };

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a cryptocurrency expert assistant for CRYPTODECRYPTO. Provide accurate and helpful information about cryptocurrencies. Only provide price information if explicitly asked. If asked about prices, use this data: ${JSON.stringify(
              contextData
            )}. Include the current date and time only when relevant to the query. User query: ${inputMessage}`,
          },
          {
            role: "user",
            content: inputMessage,
          },
        ],
      });

      const aiResponse = response.choices[0].message.content;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: aiResponse, isAi: true },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Error: Unable to process your request. Retry?",
          isAi: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Crypto AI Nexus</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="chatbot-messages">
            {isLoggedIn ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isAi ? "ai" : "user"}`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ))
            ) : (
              <div className="login-prompt">
                <p>Please log in to access the Crypto AI Nexus.</p>
              </div>
            )}
            {isLoading && isLoggedIn && (
              <div className="loading">Decoding...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {isLoggedIn && (
            <form onSubmit={handleSendMessage} className="chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Transmit your query..."
                className="input-field"
                disabled={isLoading}
              />
              <button type="submit" className="send-btn" disabled={isLoading}>
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      )}
      {robotRecommendation && isLoggedIn && !isOpen && (
        <div className="robot-container">
          <div className="robot-speech">
            <ReactMarkdown>{robotRecommendation.text}</ReactMarkdown>
          </div>
          <RobotSVG />
        </div>
      )}
    </div>
  );
}
