import { fetchCryptoNews } from "../../utils/rss";

// Helper: Fetch unlocks from DefiLlama
async function fetchUnlocks() {
  const resp = await fetch("https://coins.llama.fi/unlocks");
  const data = await resp.json();

  // ناخد top 5 based on token amount
  const top = data.projects
    .sort((a, b) => b.nextUnlock?.amount - a.nextUnlock?.amount)
    .slice(0, 5);

  return top.map(p => `${p.project}: ${p.nextUnlock.amount} tokens on ${p.nextUnlock.date}`).join("\n");
}

// Helper: Fetch airdrops (مثال API DefiLlama لو عنده)
async function fetchAirdrops() {
  const resp = await fetch("https://api.llama.fi/airdrops");
  const data = await resp.json();
  return data.slice(0, 5).map(a => `- ${a.name}: ${a.description}`).join("\n");
}

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
    // أول مرة يدخل
    if (messages.length === 1) {
      return res.status(200).json({
        reply: "👋 Hi! You can ask me:\n- latest crypto news\n- top unlocks\n- airdrops"
      });
    }

    // لو عايز أخبار
    if (userMessage.includes("news")) {
      const news = await fetchCryptoNews(5);
      const formatted = news.map(n => `- ${n.title} (${n.link})`).join("\n");
      return res.status(200).json({ reply: `📰 Latest news:\n${formatted}` });
    }

    // لو عايز unlocks
    if (userMessage.includes("unlock")) {
      const unlocks = await fetchUnlocks();
      return res.status(200).json({ reply: `🔓 Biggest upcoming unlocks:\n${unlocks}` });
    }

    // لو عايز airdrops
    if (userMessage.includes("airdrop")) {
      const drops = await fetchAirdrops();
      return res.status(200).json({ reply: `🎁 Upcoming airdrops:\n${drops}` });
    }

    // fallback
    return res.status(200).json({
      reply: "I can show you news, unlocks, or airdrops. Try asking me!"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error", message: err.message });
  }
}
