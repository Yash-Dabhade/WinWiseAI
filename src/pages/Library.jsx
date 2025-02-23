import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

// Sample proposal data structure
const sampleProposalContent = {
  executiveSummary:
    "This comprehensive proposal outlines our strategy for implementing innovative solutions tailored to meet the client's specific needs and objectives.",
  projectScope:
    "The project encompasses full-scale implementation, including system architecture, development, testing, and deployment phases with ongoing support.",
  timeline:
    "The project will be executed over a 6-month period, with key milestones and deliverables scheduled at regular intervals to ensure steady progress.",
  budget:
    "Total project investment is structured to provide maximum value while maintaining cost efficiency throughout the implementation.",
  nextSteps:
    "Upon approval, our team will initiate the project kickoff phase and begin detailed planning with key stakeholders.",
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const ProposalOutput = ({ proposal }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {proposal.title}
      </h2>
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold mb-2">Executive Summary</h3>
        <p className="mb-4">{proposal.executiveSummary}</p>

        <h3 className="text-xl font-semibold mb-2">Project Scope</h3>
        <p className="mb-4">{proposal.projectScope}</p>

        <h3 className="text-xl font-semibold mb-2">Timeline</h3>
        <p className="mb-4">{proposal.timeline}</p>

        <h3 className="text-xl font-semibold mb-2">Budget</h3>
        <p className="mb-4">{proposal.budget}</p>

        <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
        <p>{proposal.nextSteps}</p>
      </div>
    </div>
  );
};

export default function Library() {
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [showAll, setShowAll] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ROLES = {
    SALES: "Sales",
    MARKETING: "Marketing",
    ENGINEERING: "Engineering",
    CONSULTING: "Consulting",
  };

  const proposals = [
    {
      id: 1,
      title: "Enterprise CRM Implementation",
      client: "Tech Solutions Inc.",
      role: ROLES.ENGINEERING,
      date: "2024-02-20",
      value: "$250,000",
      status: "Approved",
      ...sampleProposalContent,
    },
    {
      id: 2,
      title: "Digital Marketing Campaign",
      client: "Global Retail Co.",
      role: ROLES.MARKETING,
      date: "2024-02-18",
      value: "$75,000",
      status: "Approved",
      ...sampleProposalContent,
    },
    {
      id: 3,
      title: "Sales Territory Expansion",
      client: "Growth Corp",
      role: ROLES.SALES,
      date: "2024-02-15",
      value: "$150,000",
      status: "Approved",
      ...sampleProposalContent,
    },
    {
      id: 4,
      title: "Business Process Optimization",
      client: "Industry Leaders Ltd.",
      role: ROLES.CONSULTING,
      date: "2024-02-10",
      value: "$180,000",
      status: "Approved",
      ...sampleProposalContent,
    },
  ];

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const filteredProposals = proposals.filter(
    (proposal) => selectedRole === "ALL" || proposal.role === selectedRole
  );

  const displayedProposals = showAll
    ? filteredProposals
    : filteredProposals.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Proposal Library</h1>
        <div className="flex space-x-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {proposal.client}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {proposal.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Role:</span>
                  <span className="text-gray-700">{proposal.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-700">
                    {new Date(proposal.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Value:</span>
                  <span className="text-gray-700">{proposal.value}</span>
                </div>
              </div>
              <button
                onClick={() => handleViewProposal(proposal)}
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                View Proposal <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProposals.length > 3 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showAll ? "Show Less" : "View More"}
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProposal(null);
        }}
      >
        {selectedProposal && <ProposalOutput proposal={selectedProposal} />}
      </Modal>
    </div>
  );
}
