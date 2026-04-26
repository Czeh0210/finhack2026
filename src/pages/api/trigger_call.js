export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;

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
          to_number: phoneNumber || "+60177163313",
          agent_phone_number_id: "phnum_1001kq2s1jfwfef8jpk5r60aqjb0"



        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail?.message || 'Failed to trigger call');
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}