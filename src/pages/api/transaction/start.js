/**
 * API Route: /api/transaction/start
 *
 * Proxies the fraud risk evaluation request to the AWS Lambda backend,
 * avoiding CORS issues from direct browser-to-API calls.
 */

const AWS_ENDPOINT =
  "https://n00ee9i749.execute-api.ap-southeast-5.amazonaws.com/transaction/start";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, amount, recipient } = req.body;

  console.log("[API Proxy] Forwarding transaction/start:", { userId, amount, recipient });

  try {
    const response = await fetch(AWS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, recipient }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[API Proxy] AWS returned error:", response.status, data);
      return res.status(response.status).json(data);
    }

    console.log("[API Proxy] AWS response:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("[API Proxy] Request failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
