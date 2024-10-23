/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, color } from "framer-motion";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=c2dc0f31d8964d8892d2e73f5f236226&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.articles) {
        setNews((prevNews) => [...prevNews, ...data.articles]);
      } else {
        throw new Error("No articles found");
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div style={styles.newsPage}>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.title}
      >
        Crypto News & Market Updates
      </motion.h1>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.error}
        >
          Error loading news: {error}
        </motion.p>
      )}

      <AnimatePresence>
        {news.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.newsContainer}
          >
            {news.map((article, index) => (
              <motion.div
                key={`${article.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={styles.newsCard}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={article.urlToImage || "https://via.placeholder.com/150"}
                  alt={article.title}
                  style={styles.newsImage}
                />
                <h3 style={styles.newsTitle}>{article.title}</h3>
                <p style={styles.newsDescription}>
                  {article.description
                    ? article.description.slice(0, 150) + "..."
                    : "No description available."}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.readMore}
                >
                  Read More
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && news.length === 0 && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.noNews}
        >
          No news articles available.
        </motion.p>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.spinnerContainer}
        >
          <div style={styles.spinner}></div>
        </motion.div>
      )}

      {!loading && news.length > 0 && (
        <motion.button
          onClick={loadMore}
          style={styles.loadMoreButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </motion.button>
      )}
    </div>
  );
};

const styles = {
  newsPage: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#2c260b",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2.5rem",
    color: "#f39c12",
    textAlign: "center",
    marginTop: "60px",
  },
  newsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "35px",
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  newsImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  newsTitle: {
    fontSize: "1.2rem",
    padding: "15px",
    margin: "0",
    color: "#333",
  },
  newsDescription: {
    fontSize: "0.9rem",
    padding: "0 15px 15px",
    color: "#666",
  },
  readMore: {
    display: "inline-block",
    padding: "10px 15px",
    backgroundColor: "#f39c12",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    margin: "0 15px 15px",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  noNews: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  loadMoreButton: {
    display: "block",
    margin: "30px auto",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Adding CSS Keyframes for spinner animation
const globalStyles = document.createElement("style");
globalStyles.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(globalStyles);

export default News;
