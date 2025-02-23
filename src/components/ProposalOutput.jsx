const ProposalOutput = ({ proposal }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Generated Proposal
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

export default ProposalOutput;
