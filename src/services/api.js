// api.js

const getIAMToken = async (apiKey) => {
  const tokenUrl = "/api/iam/identity/token"; // Proxied path
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
  params.append("apikey", apiKey);

  console.log("Fetching IAM token with:", {
    url: tokenUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("IAM Token Error Response:", errorText);
    throw new Error(
      `Failed to get IAM token: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.access_token;
};

export const generateProposal = async ({
  clientName,
  industry,
  companySize,
  projectRequirements,
  budget,
  timeline,
}) => {
  const API_KEY = import.meta.env.VITE_IBM_API_KEY;
  const url = "/api/ml/ml/v1/text/generation?version=2023-05-29"; // Proxied path
  const projectId = import.meta.env.VITE_IBM_PROJECT_ID;

  if (!API_KEY || !projectId) {
    throw new Error("Missing API_KEY or projectId in environment variables");
  }

  try {
    const iamToken = await getIAMToken(API_KEY);

    const proposalPrompt = `Generate a professional business proposal with the following details:
      
          Company: ${clientName}
          Industry: ${industry}
          Company Size: ${companySize}
          Project Requirements: ${projectRequirements}
          Budget: ${budget}
          Timeline: ${timeline}
      
          Format the proposal with the following sections:
          1. Executive Summary
          2. Project Overview
          3. Proposed Solution
          4. Timeline and Milestones
          5. Investment and ROI
          6. Next Steps
      
          Make it formal, professional, and detailed while keeping each section clearly separated with markdown formatting (use ## for section titles).`;

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${iamToken}`,
    };

    const body = {
      input: proposalPrompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 1000,
        min_new_tokens: 100,
        stop_sequences: [],
        repetition_penalty: 1.2,
      },
      model_id: "ibm/granite-3-8b-instruct",
      project_id: projectId,
    };

    console.log("Generating proposal with:", { url, headers, body });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Proposal Generation Error Response:", errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    const generatedText = result.results[0].generated_text;

    return formatProposalForPDF(generatedText);
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw error;
  }
};

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

export const getEmbeddings = async (texts, iamToken) => {
  const url = "/api/ml/ml/v1/text/embeddings?version=2023-10-25"; // Proxied path
  const body = {
    inputs: texts, // texts is now an array of strings
    model_id: "ibm/granite-embedding-278m-multilingual",
    project_id: import.meta.env.VITE_IBM_PROJECT_ID,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${iamToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Embedding Error Response:", errorData);
    throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
  }

  return await response.json();
};

// Compute cosine similarity between two vectors
export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};

export const analyzeOutcome = async (newProposal) => {
  const API_KEY = import.meta.env.VITE_IBM_API_KEY;

  try {
    // Load historical proposals from JSON file
    const historicalData = await fetch("/data/synthetic_proposals.json").then(
      (res) => res.json()
    );
    const iamToken = await getIAMToken(API_KEY);

    // Convert proposals to an array of strings
    const historicalTexts = historicalData.map(
      (p) =>
        `Executive Summary: ${p.executive_summary}\nProject Scope: ${p.project_scope}\nTechnical Details: ${p.technical_details}`
    );

    // Convert the new proposal to a string
    const newProposalText = `Executive Summary: ${newProposal.executive_summary}\nProject Scope: ${newProposal.project_scope}\nTechnical Details: ${newProposal.technical_details}`;

    // Get embeddings for historical proposals and new proposal
    const historicalEmbeddings = await getEmbeddings(historicalTexts, iamToken);
    const newProposalEmbedding = await getEmbeddings(
      [newProposalText],
      iamToken
    );

    // Calculate similarity between new proposal and each historical proposal
    const similarities = historicalData.map((proposal, index) => ({
      similarity: cosineSimilarity(
        newProposalEmbedding.results[0].embedding,
        historicalEmbeddings.results[index].embedding
      ),
      proposal: proposal,
    }));

    // Sort proposals by similarity (highest first) and select the top three
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topSimilar = similarities.slice(0, 3);

    // Count how many of the top proposals have outcome "win"
    const winCount = topSimilar.filter(
      (s) => s.proposal.metadata && s.proposal.metadata.outcome === "win"
    ).length;
    // Use Laplace smoothing: (winCount + 1) / (total + 2) ensures a probability > 0
    const winProbability = (winCount + 1) / (topSimilar.length + 2);

    return {
      outcome: winProbability >= 0.5 ? "win" : "loss",
      probability: winProbability,
    };
  } catch (error) {
    console.error("Error in outcome analysis:", error);
    throw error;
  }
};

// Knowledge base
const knowledgeBase = {
  executiveSummary: [
    "Executive summaries must include clear ROI metrics and quantifiable business impact",
    "Value proposition should highlight unique differentiators and competitive advantages",
    "Summary should address key stakeholder concerns and business objectives",
  ],
  technical: [
    "Technical specifications must include detailed system architecture and integration points",
    "Performance metrics and SLAs should be clearly defined with measurement criteria",
    "Security and compliance requirements must be explicitly addressed",
  ],
  timeline: [
    "Project timeline should include risk buffers and contingency planning",
    "Dependencies between phases must be clearly mapped with critical path identified",
    "Resource allocation should be specified for each project phase",
  ],
  budget: [
    "Budget breakdown should include both direct and indirect costs",
    "ROI calculations must consider both quantitative and qualitative benefits",
    "Payment milestones should align with deliverable completion",
  ],
  riskMitigation: [
    "Risk assessment should cover technical, operational, and business risks",
    "Mitigation strategies must include preventive and reactive measures",
    "Impact analysis should quantify potential losses and mitigation costs",
  ],
};

// Main analysis function
export const analyzeProposalWithRAG = async (proposalText) => {
  const API_KEY = import.meta.env.VITE_IBM_API_KEY;

  try {
    console.log("Getting IAM token...");
    const iamToken = await getIAMToken(API_KEY);

    // Flatten knowledge base for embeddings
    const allPractices = Object.values(knowledgeBase).flat();

    console.log("Getting embeddings...");
    // Get embeddings using the proxy
    const proposalEmbeddingResult = await getEmbeddings(
      [proposalText],
      iamToken
    );
    const knowledgeBaseEmbeddingResult = await getEmbeddings(
      allPractices,
      iamToken
    );

    // Calculate similarities
    const proposalEmbedding = proposalEmbeddingResult.results[0].embedding;
    const knowledgeBaseEmbeddings = knowledgeBaseEmbeddingResult.results.map(
      (r) => r.embedding
    );

    const similarities = allPractices.map((text, index) => ({
      text,
      similarity: cosineSimilarity(
        proposalEmbedding,
        knowledgeBaseEmbeddings[index]
      ),
    }));

    const topPractices = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    console.log("Generating analysis...");
    // Generate final analysis using the proxy
    const analysisResponse = await fetch(
      "/api/ml/ml/v1/text/generation?version=2023-05-29", // Use proxy path
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${iamToken}`,
        },
        body: JSON.stringify({
          input: `As an expert business proposal analyst, review this proposal using these best practices:
${topPractices.map((p) => `- ${p.text}`).join("\n")}

Proposal to analyze:
${proposalText}

Provide a comprehensive analysis in this format:

QUANTITATIVE SCORING
Rate each aspect from 1-10 and provide brief justification:
- Clarity: [score] - [justification]
- Completeness: [score] - [justification]
- Feasibility: [score] - [justification]
- Value Proposition: [score] - [justification]
Overall Score: [weighted average]

DETAILED ANALYSIS
For each section below, provide specific findings and recommendations:

AREA: [section name]
CURRENT STATE: [detailed current analysis]
GAPS: [identified gaps]
IMPACT: [business impact of gaps]
PRIORITY: [High/Medium/Low]
RECOMMENDATIONS: [specific, actionable improvements]
IMPLEMENTATION COMPLEXITY: [Easy/Medium/Hard]
EXPECTED ROI: [Low/Medium/High with justification]
---`,
          model_id: "ibm/granite-3-8b-instruct",
          project_id: import.meta.env.VITE_IBM_PROJECT_ID,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: 1500,
            min_new_tokens: 200,
            temperature: 0.7,
            repetition_penalty: 1.2,
          },
        }),
      }
    );

    if (!analysisResponse.ok) {
      console.error("Analysis API Error:", await analysisResponse.text());
      throw new Error(`Analysis error: ${analysisResponse.status}`);
    }

    const analysisResult = await analysisResponse.json();

    return {
      relevantPractices: topPractices,
      analysis: analysisResult.results[0].generated_text,
      metadata: {
        analysisDate: new Date().toISOString(),
        modelVersion: "granite-3-8b-instruct",
        knowledgeBaseCategories: Object.keys(knowledgeBase),
      },
    };
  } catch (error) {
    console.error("Error in RAG analysis:", error);
    throw error;
  }
};
