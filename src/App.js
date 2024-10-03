import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterUser from "./register/register";

import Home from "./home";
import VerifyUser from "./verifyuser";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/verify" element={<VerifyUser />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
