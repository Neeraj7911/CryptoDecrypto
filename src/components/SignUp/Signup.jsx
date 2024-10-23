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
import "./Signup.css";
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
    </div>
  );
};

export default Signup;
