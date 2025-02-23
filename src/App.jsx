"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProposalGenerator from "./pages/ProposalGenerator";
import Analyze from "./pages/Predict";
import Predict from "./pages/Analyze";
import Library from "./pages/Library";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route index element={<Navigate to="generate" replace />} />
        <Route path="generate" element={<ProposalGenerator />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="predict" element={<Predict />} />
        <Route path="library" element={<Library />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
