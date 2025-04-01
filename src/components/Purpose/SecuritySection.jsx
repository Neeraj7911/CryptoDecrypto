"use client";

import { useEffect, useRef } from "react";
import "./SecuritySection.css";

const SecuritySection = () => {
  const sectionRef = useRef(null);
  const lockRef = useRef(null);
  const shieldRef = useRef(null);
  const dataRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (lockRef.current) lockRef.current.classList.add("animate");
            if (shieldRef.current) shieldRef.current.classList.add("animate");
            if (dataRef.current) dataRef.current.classList.add("animate");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="security" className="security-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Security First Approach</h2>
        <p className="section-subtitle">
          Your assets are protected with industry-leading security measures
        </p>
      </div>

      <div className="security-content">
        <div className="security-visual">
          <div className="security-animation">
            <svg viewBox="0 0 200 200" className="security-svg">
              {/* Shield */}
              <g ref={shieldRef} className="security-shield">
                <path
                  d="M100 20 L180 60 V120 C180 150 150 180 100 190 C50 180 20 150 20 120 V60 L100 20Z"
                  className="shield-path"
                />
                <path
                  d="M100 40 L160 70 V120 C160 140 140 165 100 175 C60 165 40 140 40 120 V70 L100 40Z"
                  className="shield-inner"
                />
              </g>

              {/* Lock */}
              <g ref={lockRef} className="security-lock">
                <rect
                  x="70"
                  y="90"
                  width="60"
                  height="50"
                  rx="5"
                  className="lock-body"
                />
                <path
                  d="M80 90 V70 C80 55 90 45 100 45 C110 45 120 55 120 70 V90"
                  className="lock-shackle"
                />
                <circle cx="100" cy="115" r="10" className="lock-keyhole" />
              </g>

              {/* Data streams */}
              <g ref={dataRef} className="security-data">
                <path d="M30 100 C40 90, 60 85, 70 90" className="data-path" />
                <path
                  d="M130 90 C140 85, 160 90, 170 100"
                  className="data-path"
                />
                <path
                  d="M100 140 C90 150, 85 170, 90 180"
                  className="data-path"
                />
                <path
                  d="M110 180 C115 170, 110 150, 100 140"
                  className="data-path"
                />

                <circle cx="25" cy="100" r="5" className="data-node" />
                <circle cx="175" cy="100" r="5" className="data-node" />
                <circle cx="90" cy="185" r="5" className="data-node" />
                <circle cx="110" cy="185" r="5" className="data-node" />
              </g>
            </svg>
          </div>
        </div>

        <div className="security-features">
          <div className="security-feature">
            <div className="security-feature-icon">
              <svg viewBox="0 0 24 24" className="security-icon">
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  className="security-icon-rect"
                />
                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  className="security-icon-circle"
                />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  className="security-icon-path"
                />
              </svg>
            </div>
            <div className="security-feature-text">
              <h3>Secure Authentication</h3>
              <p>
                Multi-factor authentication and secure login protocols protect
                your account from unauthorized access.
              </p>
            </div>
          </div>

          <div className="security-feature">
            <div className="security-feature-icon">
              <svg viewBox="0 0 24 24" className="security-icon">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  className="security-icon-path"
                />
                <path d="M9 12l2 2 4-4" className="security-icon-check" />
              </svg>
            </div>
            <div className="security-feature-text">
              <h3>Encrypted Transactions</h3>
              <p>
                All transactions are encrypted end-to-end, ensuring your
                financial data remains private and secure.
              </p>
            </div>
          </div>

          <div className="security-feature">
            <div className="security-feature-icon">
              <svg viewBox="0 0 24 24" className="security-icon">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  className="security-icon-circle"
                />
                <path d="M12 16v-4M12 8h.01" className="security-icon-path" />
              </svg>
            </div>
            <div className="security-feature-text">
              <h3>Real-time Monitoring</h3>
              <p>
                Continuous monitoring of all activities to detect and prevent
                suspicious behavior before it becomes a threat.
              </p>
            </div>
          </div>

          <div className="security-feature">
            <div className="security-feature-icon">
              <svg viewBox="0 0 24 24" className="security-icon">
                <path
                  d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"
                  className="security-icon-path"
                />
                <path
                  d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                  className="security-icon-circle"
                />
                <path d="M9 7V4h6v3" className="security-icon-path" />
              </svg>
            </div>
            <div className="security-feature-text">
              <h3>Secure Storage</h3>
              <p>
                Your data is stored using industry-standard encryption and
                secure database technologies like Firebase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
