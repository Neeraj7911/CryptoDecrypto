"use client";

import { useEffect, useRef } from "react";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("feature-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Add to refs array
  const addToRefs = (el) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  return (
    <section id="features" className="features-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">
          Discover what makes CryptoDecrypto unique
        </p>
      </div>

      <div className="features-container">
        <div className="feature-card" ref={addToRefs}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <circle cx="12" cy="12" r="10" className="feature-circle" />
              <path d="M12 6v6l4 2" className="feature-path" />
              <path
                d="M16 16.5A7 7 0 1 1 15.5 8"
                className="feature-path-secondary"
              />
            </svg>
          </div>
          <h3 className="feature-title">Real-Time Crypto Market Tracking</h3>
          <p className="feature-description">
            Get live cryptocurrency data with responsive price trends, market
            caps, and historical charts for various cryptocurrencies.
          </p>
          <div className="feature-detail">
            <ul className="feature-list">
              <li>Live price updates</li>
              <li>Historical trend analysis</li>
              <li>Market capitalization tracking</li>
            </ul>
          </div>
        </div>

        <div className="feature-card" ref={addToRefs}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                className="feature-rect"
              />
              <path d="M3 10h18" className="feature-path" />
              <path d="M7 15h2" className="feature-path-secondary" />
              <path d="M11 15h2" className="feature-path-secondary" />
              <path d="M15 15h2" className="feature-path-secondary" />
            </svg>
          </div>
          <h3 className="feature-title">Secure Currency Transfer System</h3>
          <p className="feature-description">
            Transfer cryptocurrency securely with unique user IDs, similar to
            MetaMask wallets, with all transactions securely stored using
            Firebase.
          </p>
          <div className="feature-detail">
            <ul className="feature-list">
              <li>Unique user wallet IDs</li>
              <li>Encrypted transfers</li>
              <li>Transaction history</li>
            </ul>
          </div>
        </div>

        <div className="feature-card" ref={addToRefs}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <path
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                className="feature-circle"
              />
              <path
                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8z"
                className="feature-path"
              />
              <path d="M12 6v2M12 16v2" className="feature-path-secondary" />
              <path d="M6 12h2M16 12h2" className="feature-path-secondary" />
            </svg>
          </div>
          <h3 className="feature-title">AI-Powered Market Predictions</h3>
          <p className="feature-description">
            Make informed decisions with AI-based crypto predictions using the
            Gemini API, historical data, and real-time analytics.
          </p>
          <div className="feature-detail">
            <ul className="feature-list">
              <li>Predictive modeling</li>
              <li>Risk assessment</li>
              <li>Investment insights</li>
            </ul>
          </div>
        </div>

        <div className="feature-card" ref={addToRefs}>
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" className="feature-svg">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                className="feature-rect"
              />
              <circle cx="12" cy="16" r="1" className="feature-circle" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" className="feature-path" />
            </svg>
          </div>
          <h3 className="feature-title">Authentication & Security</h3>
          <p className="feature-description">
            Keep your assets safe with secure login, authentication, data
            encryption, and best security practices to prevent unauthorized
            access.
          </p>
          <div className="feature-detail">
            <ul className="feature-list">
              <li>Firebase Authentication</li>
              <li>Data encryption</li>
              <li>Secure access controls</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
