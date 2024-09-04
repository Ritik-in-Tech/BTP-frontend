import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    console.log("Login clicked");
  };

  return (
    <div className="Home">
      <h1>Welcome to the Fingerprint Registration App</h1>
      <button className="App-button" onClick={handleLoginClick}>
        Login
      </button>
      <button className="App-button" onClick={handleRegisterClick}>
        Register
      </button>
    </div>
  );
};

export default Home;
