/* eslint-disable no-unused-vars */
import React from "react";
import { Github, Linkedin, Instagram, FileText } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-info">
            <h2 className="footer-title">
              <span className="logo-icon-wrapper">
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="logo-icon"
                  aria-hidden="true"
                  height="1.5em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.95 22c-4.503 0 -8.445 -3.04 -9.61 -7.413c-1.165 -4.373 .737 -8.988 4.638 -11.25a9.906 9.906 0 0 1 12.008 1.598l-3.335 3.367a5.185 5.185 0 0 0 -7.354 .013a5.252 5.252 0 0 0 0 7.393a5.185 5.185 0 0 0 7.354 .013l3.349 3.367a9.887 9.887 0 0 1 -7.05 2.912z"></path>
                </svg>
              </span>
              <span className="footer-title-text">CryptoDecrypto</span>
            </h2>
            <p className="footer-creator">Created by Neeraj Kumar</p>
            <p className="footer-copyright">
              &copy; {currentYear} All Rights Reserved
            </p>
          </div>
          <div className="footer-links">
            <h3>Connect</h3>
            <div className="social-links">
              <a
                href="https://github.com/Neeraj7911"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                href="https://www.linkedin.com/in/neeraj791"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                href="https://www.instagram.com/kumarneeraj791"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="https://resume.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
              >
                <FileText />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-thanks">
          <h3>Special Thanks</h3>
          <p>
            I extend my sincere gratitude to{" "}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              TradingView
            </a>{" "}
            and{" "}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CoinGecko
            </a>{" "}
            for providing APIs for this project.
          </p>
        </div>
      </div>
    </footer>
  );
}
