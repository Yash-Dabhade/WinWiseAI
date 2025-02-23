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
  const API_KEY =
    import.meta.env.VITE_IBM_API_KEY ||
    "YiFVqB312ECddzD_rIR89QWi_XnByeJgZJaGh1p9Z_2q";
  const url = "/api/ml/ml/v1/text/generation?version=2023-05-29"; // Proxied path
  const projectId =
    import.meta.env.VITE_IBM_PROJECT_ID ||
    "43ab8ac7-bed3-4b3f-a86e-ea4fbdf4c6b6";

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
