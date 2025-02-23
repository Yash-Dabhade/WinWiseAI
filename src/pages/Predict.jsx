"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { analyzeOutcome } from "../services/api"; // Import the analyzeOutcome function

const Predict = () => {
  const [text, setText] = useState(
    "Enter your prosposal content here... max (512 chars)"
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the proposal object based on the text input
      const proposal = {
        executive_summary: text, // Use the text from the textarea
        project_scope: "", // Add project scope if needed
        technical_details: "", // Add technical details if needed
      };

      // Call the analyzeOutcome function
      const result = await analyzeOutcome(proposal);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-900">
        Predict Win Chances
      </h2>
      <div className="bg-white text-gray-800 rounded-xl p-8 shadow-2xl max-w-5xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          placeholder="Type or paste your predict content here..."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
        >
          {loading ? "Predicting..." : "Predict Proposal"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {analysisResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Analysis Results</h3>
            <p>
              <strong>Outcome:</strong>{" "}
              <span
                className={
                  analysisResult.outcome === "win"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {analysisResult.outcome}
              </span>
            </p>
            <p>
              <strong>Probability:</strong>{" "}
              <span className="font-bold">
                {(analysisResult.probability * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Predict;
