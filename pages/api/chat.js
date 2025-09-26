import { fetchCryptoNews } from "../../utils/rss";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: "messages required" });
  }

  const userMessage = messages[messages.length - 1]?.content?.toLowerCase();

  try {
    // Step 1: First interaction → ask the user
    if (messages.length === 1) {
      return res.status(200).json({
        reply: "👋 Do you want to know the latest crypto news?"
      });
    }

    // Step 2: If user says yes
    if (userMessage.includes("yes")) {
      const news = await fetchCryptoNews(5);
      const formatted = news.map(n => `- ${n.title} (${n.link})`).join("\n");

      return res.status(200).json({
        reply: `Here are the latest crypto news:\n${formatted}`
      });
    }

    // Step 3: Fallback
    return res.status(200).json({
      reply: "I can provide you with the latest crypto news. Just say 'yes'."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error", message: err.message });
  }
}
