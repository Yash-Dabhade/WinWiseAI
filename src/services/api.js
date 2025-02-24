// api.js

// Function to generate a proposal by calling the backend
export const generateProposal = async ({
  clientName,
  industry,
  companySize,
  projectRequirements,
  budget,
  timeline,
}) => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing VITE_BACKEND_BASE_URL in environment variables");
  }

  const url = `${baseUrl}/generate-proposal`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName,
        industry,
        companySize,
        projectRequirements,
        budget,
        timeline,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to generate proposal: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data; // This will be the formatted proposal object from formatProposalForPDF
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw error;
  }
};

// Function to analyze proposal outcome by calling the backend
export const analyzeOutcome = async (newProposal) => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing VITE_BACKEND_BASE_URL in environment variables");
  }

  const url = `${baseUrl}/analyze-outcome`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProposal),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to analyze outcome: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data; // { outcome: "win" | "loss", probability: number }
  } catch (error) {
    console.error("Error in outcome analysis:", error);
    throw error;
  }
};

// Function to analyze proposal with RAG by calling the backend
export const analyzeProposalWithRAG = async (proposalText) => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing VITE_BACKEND_BASE_URL in environment variables");
  }

  const url = `${baseUrl}/analyze-proposal`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proposalText }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to analyze proposal: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data; // { relevantPractices, analysis, metadata }
  } catch (error) {
    console.error("Error in RAG analysis:", error);
    throw error;
  }
};

// Utility function to compute cosine similarity (kept client-side if needed, but not used here)
export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

// Utility function to format proposal for PDF (kept client-side if further formatting is needed)
const formatProposalForPDF = (text) => {
  const sections = text.split(/##\s+/).filter(Boolean);
  return {
    title: "Business Proposal",
    date: new Date().toLocaleDateString("en-GB"),
    sections: sections
      .map((section) => {
        const [title, ...content] = section
          .split("\n")
          .filter((line) => line.trim());
        return {
          title: title?.trim() || "",
          content: content.join("\n").trim(),
        };
      })
      .filter((section) => section.title && section.content),
  };
};
