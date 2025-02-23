import fetch from "node-fetch";

export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = `https://us-south.ml.cloud.ibm.com/${path.join("/")}`;

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw body
  },
};
