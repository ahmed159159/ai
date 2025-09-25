import Parser from "rss-parser";

const parser = new Parser();

// Crypto RSS feeds
const feeds = [
  "https://www.coindesk.com/arc/outboundfeeds/rss/",
  "https://cointelegraph.com/rss",
  "https://decrypt.co/feed",
  "https://news.bitcoin.com/feed/",
  "https://bitcoinmagazine.com/.rss/full/",
  "https://www.theblock.co/rss",
  "https://cryptopotato.com/feed/",
  "https://u.today/rss",
  "https://cryptoslate.com/feed/",
  "https://www.ccn.com/feed/"
];

export async function fetchCryptoNews(limit = 10) {
  let allItems = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      allItems = allItems.concat(
        feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate
        }))
      );
    } catch (err) {
      console.error("Error fetching RSS:", url, err.message);
    }
  }

  // Sort by date (latest first) and slice
  return allItems
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, limit);
}
