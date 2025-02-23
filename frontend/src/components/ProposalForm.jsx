"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ProposalForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    industry: "",
    companySize: "",
    projectRequirements: "",
    budget: "",
    timeline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="clientName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Client Name
          </label>
          <input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            placeholder="e.g., Tech Innovators Inc."
          />
        </div>
        <div>
          <label
            htmlFor="industry"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            placeholder="e.g., Software Development"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="companySize"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Company Size
        </label>
        <select
          id="companySize"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
        >
          <option value="" disabled>
            Select company size
          </option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="projectRequirements"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Requirements
        </label>
        <textarea
          id="projectRequirements"
          name="projectRequirements"
          value={formData.projectRequirements}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          placeholder="e.g., Develop an AI-powered CRM system"
        />
      </div>
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Budget
        </label>
        <input
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          placeholder="e.g., $150,000"
        />
      </div>
      <div>
        <label
          htmlFor="timeline"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Timeline
        </label>
        <input
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          placeholder="e.g., 6 months"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-800 text-white py-2 rounded-4xl duration-300 shadow-md"
      >
        {isLoading ? "Generating..." : "Begin Magic 🚀"}
      </motion.button>
    </form>
  );
};

export default ProposalForm;
