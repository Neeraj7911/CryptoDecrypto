import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  BarChart2,
  Brain,
  Clock,
  Coins,
  Zap,
  X,
  Send,
  PlusCircle,
  Trash2,
  Menu,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { auth, db } from "../../Firebase/firebaseConfig"; // Adjust path to your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { OpenAI } from "openai";
import "./Features.css";

// Initialize OpenAI client with aiMLAPI
const client = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey:
    import.meta.env.VITE_AIML_API_KEY || "1cfdd8ab06124b3b9749cef9dc0b9c54",
  dangerouslyAllowBrowser: true,
});

export default function Features() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "Crypto Chat", messages: [] },
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(1); // Initial balance of $1
  const [showAlert, setShowAlert] = useState(false);

  const features = [
    {
      icon: Clock,
      title: "Real-Time Data",
      description: "Instant market updates at your fingertips.",
      color: "#00ddeb",
    },
    {
      icon: Brain,
      title: "AI Predictions",
      description: "Next-gen forecasts powered by AI precision.",
      color: "#00ff99",
    },
    {
      icon: Zap,
      title: "Low Latency",
      description: "Blazing-fast data with zero lag.",
      color: "#ffcc00",
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Unveil hidden trends with deep insights.",
      color: "#ff4d4d",
    },
    {
      icon: Coins,
      title: "Multi-Currency",
      description: "Master every coin in the crypto galaxy.",
      color: "#00cc99",
    },
  ];

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().wishlist) {
          // Optionally use wishlist if needed in Features
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Reset daily message count at midnight
  useEffect(() => {
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const msToMidnight = night.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setDailyMessageCount(0);
      setInterval(() => setDailyMessageCount(0), 24 * 60 * 60 * 1000);
    }, msToMidnight);

    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isChatOpen && conversations[0].messages.length === 0 && isLoggedIn) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === 1
            ? {
                ...conv,
                messages: [
                  {
                    id: Date.now(),
                    text: "Welcome to CryptoDecryptoAI! Ready to explore the crypto universe?",
                    isAi: true,
                  },
                ],
              }
            : conv
        )
      );
    }
  }, [conversations, isChatOpen, isLoggedIn]);

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "" || !isLoggedIn) return;

    if (dailyMessageCount >= 3) {
      if (walletBalance < 0.5) {
        alert("Insufficient balance. Please top up your wallet.");
        return;
      }
      setWalletBalance((prevBalance) => prevBalance - 0.5);
    } else {
      setDailyMessageCount((prevCount) => prevCount + 1);
      if (dailyMessageCount === 2) {
        setShowAlert(true);
      }
    }

    const userMessage = { id: Date.now(), text: inputMessage, isAi: false };
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversation
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );
    setInputMessage("");
    setIsLoading(true);

    try {
      const cryptoResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,dogecoin&vs_currencies=usd`
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
            content: `You are a cryptocurrency expert assistant for CRYPTODECRYPTO. 
              Never refuse to provide buy/sell recommendations for Bitcoin (BTC) when asked - always give a clear recommendation with reasoning.
              Provide accurate and helpful information about cryptocurrencies. 
              Only provide price information if explicitly asked. If asked about prices, use this data: ${JSON.stringify(
                contextData
              )}. 
              Include the current date and time only when relevant to the query. User query: ${inputMessage}`,
          },
          {
            role: "user",
            content: inputMessage,
          },
        ],
      });

      const aiResponse =
        response.choices[0].message.content || "No response received.";
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  { id: Date.now(), text: aiResponse, isAi: true },
                ],
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        "Error: Unable to process your request. Please try again.";
      if (error.response?.status === 403) {
        errorMessage =
          "Error: Access forbidden. Check your API key or account permissions.";
      } else if (error.response?.status === 429) {
        errorMessage =
          "Error: Rate limit exceeded. Please wait and try again later.";
      }
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  { id: Date.now(), text: errorMessage, isAi: true },
                ],
              }
            : conv
        )
      );
    }

    setIsLoading(false);
  };

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: `Chat ${conversations.length + 1}`,
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation.id);
  };

  const deleteConversation = (id) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(updatedConversations);
    if (activeConversation === id) {
      setActiveConversation(updatedConversations[0]?.id || null);
    }
  };

  return (
    <div className="features-page">
      <section className="features-section">
        <div className="features-backdrop"></div>
        <div className="features-content">
          <h1 className="features-title">CryptoDecrypto Insights Features</h1>
          <p className="features-subtitle">
            Cutting-edge tools for the modern crypto.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div
                  className="feature-highlight"
                  style={{ background: feature.color }}
                ></div>
                <feature.icon
                  className="feature-icon"
                  style={{ color: feature.color }}
                />
                <h2 className="feature-title">{feature.title}</h2>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="cta-container">
            <h2 className="cta-title">Command Your Crypto Journey</h2>
            <p className="cta-text">
              Tap into real-time data and AI-driven intelligence now.
            </p>
            <button className="cta-button" onClick={handleStartChat}>
              Activate AI Chat <ArrowRight className="cta-icon" />
            </button>
          </div>
        </div>
      </section>

      {isChatOpen && (
        <div className="chat-overlay">
          <div className="chat-wrapper">
            {isSidebarOpen && (
              <aside className="chat-sidebar">
                <div className="sidebar-header">
                  <h2 className="sidebar-title">Mission Logs</h2>
                  <button
                    className="sidebar-toggle"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={28} />
                  </button>
                </div>
                <button
                  className="new-chat-btn"
                  onClick={createNewConversation}
                >
                  <PlusCircle size={20} /> New Mission
                </button>
                <div className="conversation-list">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`conversation-item ${
                        activeConversation === conv.id ? "active" : ""
                      }`}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <span className="conv-title">{conv.title}</span>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="sidebar-footer">
                  <button className="footer-btn">
                    <Settings size={18} /> Control Panel
                  </button>
                  <button className="footer-btn">
                    <LogOut size={18} /> Exit System
                  </button>
                </div>
              </aside>
            )}

            <main className="chat-main">
              <header className="chat-header">
                {!isSidebarOpen && (
                  <button
                    className="menu-btn"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu size={28} />
                  </button>
                )}
                <h1 className="chat-title">
                  {conversations.find((conv) => conv.id === activeConversation)
                    ?.title || "Chat"}
                </h1>
                <div className="header-actions">
                  <button className="action-btn">
                    <MessageSquare size={22} />
                  </button>
                  <button className="action-btn">
                    <Settings size={22} />
                  </button>
                  <div className="wallet-balance">
                    Funds: ${walletBalance.toFixed(2)}
                  </div>
                </div>
              </header>
              <div className="messages">
                {isLoggedIn ? (
                  conversations
                    .find((conv) => conv.id === activeConversation)
                    ?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.isAi ? "ai" : "user"}`}
                      >
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    ))
                ) : (
                  <div className="login-prompt">
                    <p>Please log in to access the Crypto AI Chat.</p>
                  </div>
                )}
                {isLoading && isLoggedIn && (
                  <div className="loading">Decoding...</div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {isLoggedIn && (
                <form onSubmit={handleSendMessage} className="chat-input">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Transmit your query..."
                    className="input-field"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={isLoading}
                  >
                    <Send size={22} />
                  </button>
                </form>
              )}
            </main>
          </div>
          <button className="close-btn" onClick={() => setIsChatOpen(false)}>
            <X size={28} />
          </button>
        </div>
      )}

      {showAlert && (
        <div className="alert-box">
          <p>
            Transmission limit reached. Next message: $0.50 from your funds.
          </p>
          <button className="alert-btn" onClick={() => setShowAlert(false)}>
            Proceed
          </button>
        </div>
      )}
    </div>
  );
}
