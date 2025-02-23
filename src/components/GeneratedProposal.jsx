"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

const GeneratedProposal = ({ proposal }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(proposal.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${proposal.date}`, 20, 30);

    let yOffset = 40;
    proposal.sections.forEach((section) => {
      doc.setFontSize(14);
      doc.text(section.title, 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, yOffset);
      yOffset += lines.length * 7 + 10;
    });

    doc.save("proposal.pdf");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto my-8"
    >
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        {proposal.title}
      </h1>
      <p className="text-gray-600 mb-6">Date: {proposal.date}</p>
      {proposal.sections.map((section, index) => (
        <div key={index} className="mb-6 prose max-w-none">
          <ReactMarkdown>{`${section.title}\n\n${section.content}`}</ReactMarkdown>
        </div>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
        onClick={exportToPDF}
      >
        Export as PDF
      </motion.button>
    </motion.div>
  );
};

export default GeneratedProposal;
