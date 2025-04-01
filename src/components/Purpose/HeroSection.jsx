"use client";

import { useEffect, useRef } from "react";
import "./HeroSection.css";
import CryptoSVG from "./CryptoSVG";

const HeroSection = () => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    const svg = svgRef.current;

    title.classList.add("animate-in");

    setTimeout(() => {
      description.classList.add("animate-in");
    }, 400);

    setTimeout(() => {
      cta.classList.add("animate-in");
    }, 800);

    setTimeout(() => {
      svg.classList.add("animate-in");
    }, 1200);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 ref={titleRef} className="hero-title">
            <span className="gradient-text">Secure</span> &{" "}
            <span className="gradient-text">AI-Powered</span> Cryptocurrency
            Platform
          </h1>
          <p ref={descriptionRef} className="hero-description">
            CryptoDecrypto combines real-time market tracking, secure
            transactions, and AI-driven predictions to revolutionize your
            cryptocurrency experience.
          </p>
          <div ref={ctaRef} className="hero-cta">
            <button className="cta-button primary">
              <span>Get Started</span>
              <svg viewBox="0 0 24 24" className="arrow-icon">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="cta-button secondary">
              <span>Learn More</span>
            </button>
          </div>
        </div>
        <div ref={svgRef} className="hero-visual">
          <CryptoSVG />
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow-down">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
