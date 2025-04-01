"use client";

import { useEffect, useRef, useState } from "react";
import AIPredictionSection from "./AIPredictionSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import SecuritySection from "./SecuritySection";
import "./PurposePage.css";

const SinglePage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aiRef = useRef(null);
  const securityRef = useRef(null);
  const purposeRef = useRef(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll handling for nav highlighting
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = [
        { ref: heroRef, id: "hero" },
        { ref: featuresRef, id: "features" },
        { ref: aiRef, id: "ai" },
        { ref: securityRef, id: "security" },
        { ref: purposeRef, id: "purpose" },
      ];

      sections.forEach((section) => {
        const element = section.ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const navLink = document.querySelector(
            `.nav-link[data-section="${section.id}"]`
          );
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            navLink?.classList.add("active");
          } else {
            navLink?.classList.remove("active");
          }
        }
      });

      // Hide scroll prompt after initial scroll
      if (scrollPosition > 100 && showScrollPrompt) {
        setShowScrollPrompt(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showScrollPrompt]);

  return (
    <div className="single-page">
      {/* Neon Circuit Background */}
      <svg
        className="circuit-overlay"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="circuitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ddeb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ff99" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g className="circuit-paths">
          <path
            d="M100,100 H900 V500 H500 V900"
            stroke="url(#circuitGlow)"
            strokeWidth="2"
          />
          <path
            d="M200,200 V800 H800"
            stroke="url(#circuitGlow)"
            strokeWidth="2"
          />
          <path
            d="M300,300 H700 V700"
            stroke="url(#circuitGlow)"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
          <circle
            cx="900"
            cy="500"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
          <circle
            cx="200"
            cy="800"
            r="5"
            fill="#00ff99"
            className="circuit-node"
          />
        </g>
      </svg>

      {/* Navigation Bar */}
      <nav className="fixed-nav">
        <div className="nav-container">
          <h1 className="nav-logo">CryptoDecrypto</h1>
          <div className="nav-links">
            <button
              className="nav-link"
              data-section="hero"
              onClick={() => scrollToSection(heroRef)}
            >
              Home
            </button>
            <button
              className="nav-link"
              data-section="features"
              onClick={() => scrollToSection(featuresRef)}
            >
              Features
            </button>
            <button
              className="nav-link"
              data-section="ai"
              onClick={() => scrollToSection(aiRef)}
            >
              AI Predictions
            </button>
            <button
              className="nav-link"
              data-section="security"
              onClick={() => scrollToSection(securityRef)}
            >
              Security
            </button>
            <button
              className="nav-link"
              data-section="purpose"
              onClick={() => scrollToSection(purposeRef)}
            >
              Purpose
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll Prompt */}
      {showScrollPrompt && (
        <div className="scroll-prompt">
          <span>Scroll to Explore</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24">
            <path
              d="M12 2 L12 20 M5 13 L12 20 L19 13"
              stroke="#00ff99"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Main Content */}
      <main>
        <section ref={heroRef} className="section reveal-on-scroll">
          <HeroSection />
        </section>

        <section ref={featuresRef} className="section reveal-on-scroll">
          <FeaturesSection />
        </section>

        <section ref={aiRef} className="section reveal-on-scroll">
          <AIPredictionSection />
        </section>

        <section ref={securityRef} className="section reveal-on-scroll">
          <SecuritySection />
        </section>

        <section
          ref={purposeRef}
          className="section purpose-section reveal-on-scroll"
        >
          <h2 className="section-title">Our Purpose</h2>
          <p className="purpose-text">
            CryptoDecrypto is a secure, AI-powered cryptocurrency platform
            designed to revolutionize how you interact with digital assets. From
            real-time market tracking to predictive insights, we’re here to
            empower your financial journey with cutting-edge technology and
            uncompromised security.
          </p>
        </section>
      </main>
    </div>
  );
};

export default SinglePage;
