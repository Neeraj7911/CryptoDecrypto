import React, { useState, useEffect } from "react";
import "./News.css";

const NEWS_API_KEY = "c2dc0f31d8964d8892d2e73f5f236226";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${NEWS_API_KEY}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="news-page">
      <h1>Crypto News & Market Updates</h1>
      <div className="news-container">
        {news.map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} />
            )}
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        ))}
      </div>
      {loading && <div className="loader">Loading...</div>}
      {!loading && news.length > 0 && (
        <button onClick={loadMore} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
}

export default News;
