import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";

const API_KEY = "AIzaSyDvPDGnYgR7w9m5kk4k4zQDv5XiYLVN38g"; // Replace with your actual API key

export default function CryptoChat() {
  const [inputMessage, setInputMessage] = useState("");
  const [conversations, setConversations] = useState([
    { id: 1, title: "Crypto Chat", messages: [] },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const userMessage = { id: Date.now(), text: inputMessage, isAi: false };
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === 1
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
            }
          : conv
      )
    );
    setInputMessage("");
    setIsLoading(true);

    try {
      // Fetch real-time crypto price data for multiple coins
      const cryptoResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,dogecoin&vs_currencies=usd`
      );

      // Get current date and time
      const currentDateTime = new Date().toLocaleString();

      // Prepare context with real-time data and current date/time
      const contextData = {
        prices: cryptoResponse.data,
        currentDateTime: currentDateTime,
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a cryptocurrency expert assistant. Provide accurate and helpful information about cryptocurrencies. Only provide price information if explicitly asked. If asked about prices, use this data: ${JSON.stringify(
                    contextData
                  )}. Include the current date and time when it's relevant to the query, Only provide price information if explicitly asked. If asked about prices. User query: ${inputMessage}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiResponse) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === 1
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
      } else {
        throw new Error("No valid AI response received.");
      }
    } catch (error) {
      console.error("Error:", error);
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === 1
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: Date.now(),
                    text: "Sorry, I encountered an error. Please try again.",
                    isAi: true,
                  },
                ],
              }
            : conv
        )
      );
    }

    setIsLoading(false);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {conversations[0].messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...styles.message,
              ...(message.isAi ? styles.aiMessage : styles.userMessage),
            }}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </motion.div>
        ))}
        {isLoading && (
          <div style={styles.loadingMessage}>AI is thinking...</div>
        )}
      </div>
      <form onSubmit={handleSendMessage} style={styles.inputForm}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about crypto..."
            style={styles.messageInput}
          />
          <button type="submit" style={styles.sendButton} disabled={isLoading}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
  message: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#2b5278",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  aiMessage: {
    backgroundColor: "#1e3a5f",
    alignSelf: "flex-start",
  },
  loadingMessage: {
    fontStyle: "italic",
    color: "#888",
  },
  inputForm: {
    padding: "20px",
    backgroundColor: "#2a2a2a",
  },
  inputContainer: {
    display: "flex",
  },
  messageInput: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px 0 0 4px",
    backgroundColor: "#3a3a3a",
    color: "white",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
  },
};
