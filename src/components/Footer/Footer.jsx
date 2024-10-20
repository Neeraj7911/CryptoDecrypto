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
            <h2 className="footer-title">CryptoDecrypto</h2>
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
            We extend our gratitude to{" "}
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
            providing APIs for this project.
          </p>
        </div>
      </div>
    </footer>
  );
}
