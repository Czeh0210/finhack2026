export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phoneNumber, txId, status, score1 } = req.body;

  console.log("[trigger_call] Received:", { txId, status, score1, phoneNumber });

  // Only proceed if the transaction status is AI_CALL_TRIGGERED
  if (status !== "AI_CALL_TRIGGERED") {
    console.log("[trigger_call] Skipped — status is not AI_CALL_TRIGGERED:", status);
    return res.status(200).json({
      message: "Call not triggered — transaction is safe",
      status,
    });
  }

  console.log("[trigger_call] Status is AI_CALL_TRIGGERED, initiating AI verification call...");

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: process.env.ELEVENLABS_AGENT_ID,
          to_number: phoneNumber || "+60103604883",
          agent_phone_number_id: "phnum_9101kq2jqavdfhstxn069gz50s43"
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail?.message || 'Failed to trigger call');
    }

    console.log("[trigger_call] AI call dispatched successfully:", data);

    return res.status(200).json({ ...data, txId, score1 });
  } catch (error) {
    console.error("[trigger_call] Failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
}