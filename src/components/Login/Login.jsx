import React, { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../../Firebase/firebaseConfig";
import { FaGoogle, FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Log In to Your Account</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <div className="separator">
          <span>or</span>
        </div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <FaGoogle /> Log in with Google
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/Get-Started">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
