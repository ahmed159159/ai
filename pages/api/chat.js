// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, max_tokens } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: 'messages required' });
  }

  const FW_KEY = process.env.FIREWORKS_API_KEY;
  if (!FW_KEY) {
    return res.status(500).json({ error: 'Missing FIREWORKS_API_KEY' });
  }

  try {
    const response = await fetch('https://api.fireworks.ai/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FW_KEY}`,
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
        input: { messages },
        max_tokens: max_tokens || 512,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal_error', message: err.message });
  }
}
