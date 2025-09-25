import { fetchCryptoNews } from "../../utils/rss";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, max_tokens } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: "messages required" });
  }

  const FW_KEY = process.env.FIREWORKS_API_KEY;
  if (!FW_KEY) {
    return res.status(500).json({ error: "Missing FIREWORKS_API_KEY" });
  }

  try {
    // 1. Fetch latest crypto news
    const news = await fetchCryptoNews(8);
    const newsContext = news
      .map(n => `- ${n.title} (${n.link})`)
      .join("\n");

    // 2. Add system message with latest news
    const enhancedMessages = [
      {
        role: "system",
        content: `You are Dobby, a crypto assistant. Use the following latest crypto news to answer questions:\n${newsContext}`
      },
      ...messages
    ];

    // 3. Call Fireworks AI
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FW_KEY}`
        },
        body: JSON.stringify({
          model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
          messages: enhancedMessages,
          max_tokens: max_tokens || 512
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send({ error: text });
    }

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "",
      raw: data
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "internal_error", message: err.message });
  }
}
