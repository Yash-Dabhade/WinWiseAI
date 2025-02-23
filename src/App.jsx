"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProposalGenerator from "./pages/ProposalGenerator";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={<ProposalGenerator />} />
    </Routes>
  </Router>
);

export default App;
