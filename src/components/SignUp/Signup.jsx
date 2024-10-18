/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  db,
} from "../../Firebase/firebaseConfig";
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaTimes } from "react-icons/fa";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Signup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Handle email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        password,
        uid: user.uid,
      });

      // Close modal after successful signup
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Google signup and login
  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if the user is already in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Store Google user data in Firestore (only if the user is new)
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      }

      // Close modal after successful Google signup/login
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Create Your Account</h2>

        {/* Signup form */}
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          {/* Display error message if there's an error */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {/* Separator */}
        <div className="separator">
          <span>or</span>
        </div>

        {/* Google signup button */}
        <button onClick={handleGoogleSignup} className="google-btn">
          <FaGoogle /> Sign up with Google
        </button>

        {/* Link to login page */}
        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>

      {/* Inline CSS for the component */}
      <style jsx>{`
        .signup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .signup-container {
          background: linear-gradient(135deg, #1e2a38, #2a3f55);
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
          color: #fff;
          animation: fadeIn 0.5s ease-out;
          position: relative;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .close-btn:hover {
          transform: rotate(90deg);
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          color: #f1c40f;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #f1c40f;
        }

        input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: none;
          border-radius: 25px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        input:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 2px #f1c40f;
        }

        .signup-btn,
        .google-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          display: flex;
          justify-content: center;
        }

        .signup-btn {
          background-color: #f1c40f;
          color: #2a3f55;
          margin-bottom: 1rem;
          text-align: center;
        }

        .signup-btn:hover {
          background-color: #f39c12;
          transform: translateY(-2px);
        }

        .google-btn {
          background-color: #fff;
          color: #2a3f55;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .google-btn:hover {
          background-color: #e6e6e6;
          transform: translateY(-2px);
        }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1rem 0;
        }

        .separator::before,
        .separator::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .separator span {
          padding: 0 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .login-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .login-link a {
          color: #f1c40f;
          text-decoration: none;
          font-weight: bold;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .error-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Signup;
