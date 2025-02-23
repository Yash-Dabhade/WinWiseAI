"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import GeneratedProposal from "../components/GeneratedProposal";
import ProposalForm from "../components/ProposalForm";
import { generateProposal } from "../services/api";

const ProposalGenerator = () => {
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const proposalRef = useRef(null);

  useEffect(() => {
    if (proposal && proposalRef.current) {
      proposalRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [proposal]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const generatedProposal = await generateProposal(formData);
      setProposal(generatedProposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
      setProposal({
        title: "Error",
        date: new Date().toLocaleDateString("en-GB"),
        sections: [
          {
            title: "Error",
            content: "Failed to generate proposal. Please try again.",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-400 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto "
      >
        <div className="flex items-center justify-center space-x-2 mb-8">
          <img src="/crown.png" alt="WinWise AI Logo" className="w-12 h-12" />
          <h1 className="text-4xl font-bold text-center text-orange-400">
            WinWise AI Generator
          </h1>
        </div>

        <div className="text-white rounded-xl p-8 shadow-2xl max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-900">
            Generate Your Proposal
          </h2>
          <ProposalForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {proposal && (
          <motion.div
            ref={proposalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <GeneratedProposal proposal={proposal} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProposalGenerator;
