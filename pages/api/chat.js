export default async function handler(req, res) {
  try {
    // ---------------------------
    // 1) جلب بيانات Airdrops
    // ---------------------------
    const fetchAirdrops = async () => {
      try {
        const url = process.env.AIRDROP_API || "https://example.com/api/airdrops";
        const resp = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; DobbyBot/1.0)" }
        });

        if (!resp.ok) {
          console.error("Airdrops API failed:", resp.status);
          return [];
        }

        const text = await resp.text();
        if (!text) return [];

        try {
          return JSON.parse(text);
        } catch (err) {
          console.error("Airdrops JSON parse error:", err);
          return [];
        }
      } catch (err) {
        console.error("Error fetching airdrops:", err);
        return [];
      }
    };

    // ---------------------------
    // 2) جلب RSS Feeds
    // ---------------------------
    const fetchRSS = async (url) => {
      try {
        const resp = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; DobbyBot/1.0)" }
        });

        if (!resp.ok) {
          console.error(`Error fetching RSS: ${url} Status: ${resp.status}`);
          return null;
        }

        const text = await resp.text();
        return text;
      } catch (err) {
        console.error("RSS Fetch error:", url, err);
        return null;
      }
    };

    // جهز روابط RSS من الـ env أو default
    const rssFeeds = process.env.RSS_FEEDS
      ? JSON.parse(process.env.RSS_FEEDS)
      : [
          "https://bitcoinmagazine.com/.rss/full/",
          "https://cryptoslate.com/feed/",
          "https://cryptopotato.com/feed/"
        ];

    const airdrops = await fetchAirdrops();
    const rssResults = await Promise.all(rssFeeds.map((url) => fetchRSS(url)));

    // ---------------------------
    // 3) Response نهائي
    // ---------------------------
    res.status(200).json({
      success: true,
      airdrops,
      rss: rssResults.filter((r) => r !== null),
    });

  } catch (err) {
    console.error("Handler Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
