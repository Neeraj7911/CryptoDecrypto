"use client";

import { useEffect, useRef, useState } from "react";
import "./AIPredictionSection.css";

const AIPredictionSection = () => {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate random data points
    const generateData = () => {
      const points = [];
      const numPoints = 100;

      for (let i = 0; i < numPoints; i++) {
        const x = i * (canvas.width / numPoints);
        const y =
          canvas.height / 2 +
          Math.sin(i * 0.1) * 50 +
          (Math.random() * 30 - 15);
        points.push({ x, y });
      }

      return points;
    };

    // Draw prediction line
    const drawPredictionLine = (points, color, lineWidth) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Draw prediction area
    const drawPredictionArea = (points, color) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }

      ctx.lineTo(points[points.length - 1].x, canvas.height);
      ctx.lineTo(points[0].x, canvas.height);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
    };

    // Animation
    let animationFrame;
    let progress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Historical data
      const historicalData = generateData().slice(
        0,
        Math.floor(progress * 100)
      );

      if (historicalData.length > 0) {
        // Draw area
        drawPredictionArea(historicalData, "rgba(32, 129, 226, 0.1)");

        // Draw line
        drawPredictionLine(historicalData, "#2081e2", 2);
      }

      // Prediction data
      if (progress > 0.7) {
        const predictionProgress = (progress - 0.7) / 0.3;
        const predictionData = generateData().slice(Math.floor(progress * 100));
        const visiblePredictionData = predictionData.slice(
          0,
          Math.floor(predictionProgress * predictionData.length)
        );

        if (visiblePredictionData.length > 0) {
          // Draw area
          drawPredictionArea(visiblePredictionData, "rgba(130, 71, 229, 0.1)");

          // Draw line
          drawPredictionLine(visiblePredictionData, "#8247e5", 2);

          // Draw prediction confidence intervals
          const upperBound = visiblePredictionData.map((point) => ({
            x: point.x,
            y: point.y - 20,
          }));
          const lowerBound = visiblePredictionData.map((point) => ({
            x: point.x,
            y: point.y + 20,
          }));

          drawPredictionLine(upperBound, "rgba(130, 71, 229, 0.5)", 1);
          drawPredictionLine(lowerBound, "rgba(130, 71, 229, 0.5)", 1);
        }
      }

      // Data points
      const dataPoints = generateData().slice(0, Math.floor(progress * 100));
      dataPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#2081e2";
        ctx.fill();
      });

      progress += 0.005;
      if (progress > 1) progress = 0;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isVisible]);

  return (
    <section id="ai" className="ai-prediction-section" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">AI-Powered Predictions</h2>
        <p className="section-subtitle">
          Make informed decisions with our advanced AI technology
        </p>
      </div>

      <div className="ai-content">
        <div className="ai-text">
          <div className={`ai-feature ${isVisible ? "visible" : ""}`}>
            <div className="ai-feature-icon">
              <svg viewBox="0 0 24 24" className="ai-icon">
                <circle cx="12" cy="12" r="10" className="ai-icon-circle" />
                <path d="M12 16v-4M12 8h.01" className="ai-icon-path" />
              </svg>
            </div>
            <div className="ai-feature-text">
              <h3>Predictive Analysis</h3>
              <p>
                Our AI analyzes historical data and market trends to predict
                future cryptocurrency movements with high accuracy.
              </p>
            </div>
          </div>

          <div className={`ai-feature ${isVisible ? "visible" : ""}`}>
            <div className="ai-feature-icon">
              <svg viewBox="0 0 24 24" className="ai-icon">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="ai-icon-path" />
              </svg>
            </div>
            <div className="ai-feature-text">
              <h3>Risk Assessment</h3>
              <p>
                Evaluate potential risks and rewards with AI-generated
                confidence intervals and volatility predictions.
              </p>
            </div>
          </div>

          <div className={`ai-feature ${isVisible ? "visible" : ""}`}>
            <div className="ai-feature-icon">
              <svg viewBox="0 0 24 24" className="ai-icon">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  className="ai-icon-path"
                />
                <polyline points="7 10 12 15 17 10" className="ai-icon-path" />
                <line x1="12" y1="15" x2="12" y2="3" className="ai-icon-path" />
              </svg>
            </div>
            <div className="ai-feature-text">
              <h3>Investment Insights</h3>
              <p>
                Receive personalized investment recommendations based on your
                portfolio, risk tolerance, and market conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="ai-visualization">
          <div className="chart-container">
            <canvas ref={canvasRef} className="prediction-chart"></canvas>
            <div className="chart-labels">
              <div className="chart-label historical">
                <span className="label-color"></span>
                <span className="label-text">Historical Data</span>
              </div>
              <div className="chart-label prediction">
                <span className="label-color"></span>
                <span className="label-text">AI Prediction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPredictionSection;
