export default async function handler(req, res) {
  // نسمح فقط بـ POST requests
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
    // Fireworks Chat Completion endpoint
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FW_KEY}`,
      },
      body: JSON.stringify({
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages,
        max_tokens: max_tokens || 512,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send({ error: text });
    }

    const data = await response.json();

    // الرد بيرجع من Fireworks في choices[0].message.content
    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "",
      raw: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal_error', message: err.message });
  }
}
