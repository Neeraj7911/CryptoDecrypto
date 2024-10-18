/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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

const Features = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "General Chat", messages: [] },
    { id: 2, title: "Coding Assistant", messages: [] },
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const features = [
    {
      icon: Clock,
      title: "Real-Time Data",
      description: "Get up-to-the-second cryptocurrency market data",
      color: "#FF6B6B",
    },
    {
      icon: Brain,
      title: "AI Predictions",
      description: "Advanced machine learning models for accurate forecasts",
      color: "#4ECDC4",
    },
    {
      icon: Zap,
      title: "Low Latency",
      description: "Lightning-fast updates with minimal delay",
      color: "#FFD93D",
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Deep insights into market trends and patterns",
      color: "#FF8811",
    },
    {
      icon: Coins,
      title: "Multi-Currency Support",
      description: "Track and analyze a wide range of cryptocurrencies",
      color: "#6A0572",
    },
  ];

  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleStartChat = () => {
    setIsChatOpen(true);
    if (conversations[0].messages.length === 0) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === 1
            ? {
                ...conv,
                messages: [
                  {
                    id: Date.now(),
                    text: "Hello! How can I assist you with CryptoAI Insights today?",
                    isAi: true,
                  },
                ],
              }
            : conv
        )
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { id: Date.now(), text: inputMessage, isAi: false },
            {
              id: Date.now() + 1,
              text: "I'm processing your request...",
              isAi: true,
            },
          ],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `Thank you for your message: "${inputMessage}". This is a simulated AI response.`;
      const updatedWithAIResponse = updatedConversations.map((conv) => {
        if (conv.id === activeConversation) {
          const lastMessage = conv.messages[conv.messages.length - 1];
          if (lastMessage.isAi) {
            return {
              ...conv,
              messages: [
                ...conv.messages.slice(0, -1),
                { ...lastMessage, text: aiResponse },
              ],
            };
          }
        }
        return conv;
      });
      setConversations(updatedWithAIResponse);
    }, 1000);
  };

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: `New Chat ${conversations.length + 1}`,
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
    <div style={styles.container}>
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <motion.h1
            style={styles.mainTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CryptoDecrypto Insights Features
          </motion.h1>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            style={styles.featureGrid}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                style={{
                  ...styles.featureCard,
                  backgroundColor: feature.color,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                }}
              >
                <feature.icon style={styles.featureIcon} />
                <h2 style={styles.featureTitle}>{feature.title}</h2>
                <p style={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={styles.ctaSection}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 style={styles.ctaTitle}>Real-Time Crypto Insights</h2>
            <p style={styles.ctaDescription}>
              Experience the power of AI-driven predictions and lightning-fast
              data updates
            </p>
            <button style={styles.ctaButton} className="glow-on-hover">
              Explore Features <ArrowRight style={styles.buttonIcon} />
            </button>
          </motion.div>
        </div>
      </section>

      <section style={styles.darkSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Why Choose CryptoAI Insights?</h2>
          <div style={styles.gridTwo}>
            {[
              {
                title: "Unparalleled Accuracy",
                description:
                  "Our AI models are trained on vast amounts of historical data, ensuring the highest level of prediction accuracy in the market.",
              },
              {
                title: "Customizable Alerts",
                description:
                  "Set up personalized notifications for price movements, trend changes, and AI-generated insights tailored to your portfolio.",
              },
              {
                title: "Comprehensive Analysis",
                description:
                  "Get in-depth market analysis, including sentiment analysis, on-chain metrics, and correlation studies across multiple cryptocurrencies.",
              },
              {
                title: "Seamless Integration",
                description:
                  "Easily integrate our API into your existing trading systems and applications for a unified trading experience.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                style={styles.gridCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.gradientSection}>
        <div style={styles.sectionContent}>
          <motion.h2
            style={styles.gradientTitle}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Revolutionize Your Crypto Trading?
          </motion.h2>
          <motion.p
            style={styles.gradientDescription}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of traders benefiting from our cutting-edge AI
            predictions and real-time data.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <motion.button
              style={styles.ctaButton}
              className="glow-on-hover"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={handleStartChat}
            >
              Try Our AI - Start Chat <ArrowRight style={styles.buttonIcon} />
            </motion.button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            style={styles.fullScreenChat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.chatContainer}>
              {/* Sidebar */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    style={styles.sidebar}
                  >
                    <div style={styles.sidebarHeader}>
                      <h2 style={styles.sidebarTitle}>Chats</h2>
                      <button
                        style={styles.iconButton}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <button
                      onClick={createNewConversation}
                      style={styles.newChatButton}
                    >
                      <PlusCircle size={16} /> New Chat
                    </button>
                    <div style={styles.conversationList}>
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          style={{
                            ...styles.conversationItem,
                            backgroundColor:
                              activeConversation === conv.id
                                ? "rgba(255, 255, 255, 0.1)"
                                : "transparent",
                          }}
                          onClick={() => setActiveConversation(conv.id)}
                        >
                          <span style={styles.conversationTitle}>
                            {conv.title}
                          </span>
                          <button
                            style={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={styles.sidebarFooter}>
                      <button style={styles.footerButton}>
                        <Settings size={16} /> Settings
                      </button>
                      <button style={styles.footerButton}>
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* Main Chat Area */}
              <main style={styles.mainChatArea}>
                {/* Chat Header */}
                <header style={styles.chatHeader}>
                  {!isSidebarOpen && (
                    <button
                      style={styles.iconButton}
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      <Menu size={24} />
                    </button>
                  )}
                  <h1 style={styles.chatTitle}>
                    {conversations.find(
                      (conv) => conv.id === activeConversation
                    )?.title || "Chat"}
                  </h1>
                  <div>
                    <button style={styles.iconButton}>
                      <MessageSquare size={20} />
                    </button>
                    <button style={styles.iconButton}>
                      <Settings size={20} />
                    </button>
                  </div>
                </header>

                {/* Messages */}
                <div style={styles.messagesContainer}>
                  {conversations
                    .find((conv) => conv.id === activeConversation)
                    ?.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          ...styles.message,
                          ...(message.isAi
                            ? styles.aiMessage
                            : styles.userMessage),
                        }}
                      >
                        {message.text}
                      </motion.div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} style={styles.inputArea}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    style={styles.input}
                  />
                  <button type="submit" style={styles.sendButton}>
                    <Send size={20} />
                  </button>
                </form>
              </main>
            </div>
            <button
              style={styles.closeChatButton}
              onClick={() => setIsChatOpen(false)}
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    padding: "80px 20px",
  },
  darkSection: {
    padding: "80px 20px",
    backgroundColor: "#1E1E1E",
  },
  gradientSection: {
    padding: "80px 20px",
    background: "linear-gradient(45deg, #FF3366, #FF6B6B, #4ECDC4, #45B7D1)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
  },
  sectionContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  mainTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "48px",
    background: "linear-gradient(45deg, #FF3366, #FF6B6B, #4ECDC4, #45B7D1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "32px",
  },
  featureCard: {
    padding: "24px",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    width: "48px",
    height: "48px",
    marginBottom: "16px",
    color: "#FFFFFF",
  },
  featureTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#FFFFFF",
  },
  featureDescription: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
  ctaSection: {
    marginTop: "64px",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#FFFFFF",
  },
  ctaDescription: {
    fontSize: "20px",
    marginBottom: "32px",
    color: "#CCCCCC",
  },
  ctaButton: {
    backgroundColor: "#FF3366",
    color: "white",
    padding: "12px 24px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(255, 51, 102, 0.4)",
  },
  buttonIcon: {
    marginLeft: "8px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "48px",
    color: "#FFFFFF",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "32px",
  },
  gridCard: {
    backgroundColor: "#2A2A2A",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#FF6B6B",
  },
  cardDescription: {
    color: "#CCCCCC",
  },
  gradientTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "16px",
    color: "#FFFFFF",
  },
  gradientDescription: {
    fontSize: "20px",
    textAlign: "center",
    marginBottom: "32px",
    color: "#FFFFFF",
  },
  fullScreenChat: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18, 18, 18, 0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  chatContainer: {
    display: "flex",
    width: "95%",
    height: "90%",
    maxWidth: "1400px",
    maxHeight: "800px",
    backgroundColor: "#1E1E1E",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#2A2A2A",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRight: "1px solid #3A3A3A",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #3A3A3A",
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  newChatButton: {
    backgroundColor: "#FF3366",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  conversationList: {
    flex: 1,
    overflowY: "auto",
  },
  conversationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "8px",
    transition: "background-color 0.3s ease",
  },
  conversationTitle: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "#FF6B6B",
    cursor: "pointer",
  },
  sidebarFooter: {
    marginTop: "auto",
  },
  footerButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: "10px",
    width: "100%",
  },
  mainChatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#121212",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #3A3A3A",
    backgroundColor: "#1E1E1E",
  },
  chatTitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    maxWidth: "70%",
    padding: "12px 18px",
    borderRadius: "18px",
    marginBottom: "12px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#FF3366",
    color: "white",
    marginLeft: "auto",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#4ECDC4",
    color: "white",
  },
  inputArea: {
    display: "flex",
    padding: "20px",
    borderTop: "1px solid #3A3A3A",
    backgroundColor: "#1E1E1E",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#2A2A2A",
    color: "white",
    fontSize: "16px",
  },
  sendButton: {
    backgroundColor: "#FF3366",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  closeChatButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

export default Features;
