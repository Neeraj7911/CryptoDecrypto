import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";

// Use environment variable or fallback to your provided key
const API_KEY =
  import.meta.env.VITE_AIML_API_KEY || "1cfdd8ab06124b3b9749cef9dc0b9c54";

export default function CryptoChat() {
  const [inputMessage, setInputMessage] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "Crypto Chat",
      messages: [
        {
          id: Date.now(),
          text: "Hello! I'm Grok, your crypto assistant powered by xAI. How can I help you today?",
          isAi: true,
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const userMessage = { id: Date.now(), text: inputMessage, isAi: false };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === 1
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );
    setInputMessage("");
    setIsLoading(true);

    try {
      // Fetch real-time crypto prices
      const cryptoResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,dogecoin&vs_currencies=usd"
      );
      const currentDateTime = new Date().toLocaleString();
      const contextData = {
        prices: cryptoResponse.data,
        currentDateTime: currentDateTime,
      };

      // Use axios instead of fetch for consistency
      const response = await axios.post(
        "https://api.aimlapi.com/v1/chat/completions",
        {
          model: "xai/grok", // Updated model name - removed "x-ai/grok-beta" as it might be incorrect
          messages: [
            {
              role: "system",
              content: `You are Grok, a cryptocurrency expert assistant created by xAI. 
                Never refuse to provide buy/sell recommendations for Bitcoin (BTC) when asked - always give a clear recommendation with reasoning.
                Only provide price information if explicitly asked. If asked about prices, use this data: ${JSON.stringify(
                  contextData
                )}.
                Include the current date and time only when relevant. Keep responses concise and professional.`,
            },
            {
              role: "user",
              content: inputMessage,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      setConversations((prev) =>
        prev.map((conv) =>
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
    } catch (error) {
      console.error("Error:", error);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === 1
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: Date.now(),
                    text: `Error: ${error.message}. Please try again.`,
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
          <div style={styles.loadingMessage}>Grok is analyzing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} style={styles.inputForm}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about crypto..."
            style={styles.messageInput}
            disabled={isLoading}
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
    padding: "12px 16px",
    borderRadius: "8px",
    maxWidth: "80%",
    lineHeight: "1.4",
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
    padding: "10px",
  },
  inputForm: {
    padding: "20px",
    backgroundColor: "#2a2a2a",
    borderTop: "1px solid #3a3a3a",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  messageInput: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#3a3a3a",
    color: "white",
    outline: "none",
  },
  sendButton: {
    padding: "12px 24px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
