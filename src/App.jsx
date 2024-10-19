/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Footer from "./components/Footer/Footer";
import News from "./components/News/News";
import ChartPage from "./components/ChartPage/ChartPage";
import Features from "./pages/Features/Features";
import HeatMaps from "./components/HeatMaps/HeatMaps";
import Signup from "./components/SignUp/Signup";
import Login from "./components/Login/Login";
import WishlistPage from "./components/WishlistPage/WishlistPage";
import Trades from "./components/Navbar/Trades";
import ProfileSettings from "./components/Navbar/ProfileSettings";

const App = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Function to open Signup modal
  const openSignup = () => setIsSignupOpen(true);

  // Function to close Signup modal
  const closeSignup = () => setIsSignupOpen(false);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:coinId" element={<Coin />} />
        <Route path="/news" element={<News />} />
        <Route path="/crypto/:id" element={<ChartPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/HeatMaps" element={<HeatMaps />} />
        <Route path="/Get-Started" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Wishlist" element={<WishlistPage />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
