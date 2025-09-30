import { fetchCryptoNews } from "../../utils/rss";

// Helper: Fetch top unlocks from DefiLlama
async function fetchUnlocks() {
  try {
    const resp = await fetch("https://coins.llama.fi/unlocks");
    const data = await resp.json();

    if (!data.projects) {
      return "⚠️ No unlock data available.";
    }

    const list = data.projects
      .map(p => {
        const firstUnlock = p.upcomingUnlocks?.[0];
        if (!firstUnlock) return null;
        return {
          project: p.project,
          symbol: p.symbol,
          amount: firstUnlock.amount,
          date: new Date(firstUnlock.date * 1000).toLocaleDateString()
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return list.map(
      u => `🔓 ${u.project} (${u.symbol}) → ${u.amount.toLocaleString()} tokens unlock on ${u.date}`
    ).join("\n");
  } catch (err) {
    console.error("Error fetching unlocks:", err);
    return "⚠️ Error fetching unlock data.";
  }
}

// Helper: Fetch upcoming airdrops from DefiLlama
async function fetchAirdrops() {
  try {
    const resp = await fetch("https://api.llama.fi/airdrops");
    const data = await resp.json();

    if (!data || !data.length) return "⚠️ No airdrop data available.";

    return data.slice(0, 5)
      .map(a => `🎁 ${a.name} → ${a.description || "No description"}`)
      .join("\n");
  } catch (err) {
    console.error("Error fetching airdrops:", err);
    return "⚠️ Error fetching airdrops.";
  }
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
