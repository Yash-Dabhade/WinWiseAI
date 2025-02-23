"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { analyzeProposalWithRAG } from "../services/api"; // Import the RAG analysis function

const Analyze = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle analysis submission
  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the RAG analysis function
      const analysisData = await analyzeProposalWithRAG(text);
      setResults(analysisData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Parse analysis text into structured format
  const parseAnalysis = (analysisText) => {
    return analysisText
      .split("\nAREA: ")
      .slice(1)
      .map((area) => {
        const lines = area.split("\n");
        const section = { area: lines[0].trim() };

        lines.slice(1).forEach((line) => {
          const [key, ...value] = line.split(": ");
          if (key && value) {
            section[key.toLowerCase().replace(" ", "_")] = value
              .join(": ")
              .trim();
          }
        });

        return section;
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Proposal Analysis
      </h2>

      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
          placeholder="Paste your proposal content here..."
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze Proposal"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-8">
          {/* Relevant Practices Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">
              Key Improvement Areas
            </h3>
            <div className="space-y-4">
              {results.relevantPractices.map((practice, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{practice.text}</span>
                    <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {(practice.similarity * 100).toFixed(1)}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">
              Detailed Analysis
            </h3>
            <div className="space-y-6">
              {parseAnalysis(results.analysis).map((section, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="text-lg font-semibold mb-2">{section.area}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Current State
                      </label>
                      <p className="mt-1 text-gray-800">
                        {section.current_state}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Identified Gaps
                      </label>
                      <p className="mt-1 text-gray-800">{section.gaps}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Recommendations
                      </label>
                      <p className="mt-1 text-gray-800">
                        {section.recommendations}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analyze;
