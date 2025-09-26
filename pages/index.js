import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory })
      });

      const data = await resp.json();
      const assistantMsg = {
        role: "assistant",
        content: data.reply || JSON.stringify(data)
      };

      setHistory(prev => [...prev, assistantMsg]);
    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." }
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Dobby Crypto News Chat</h1>
      <div style={{ border: "1px solid #ddd", padding: 12, minHeight: 300 }}>
        {history.map((m, i) => (
          <div key={i} style={{ margin: "8px 0" }}>
            <b style={{ color: m.role === "user" ? "#0b5fff" : "#111" }}>
              {m.role === "user" ? "You" : "Dobby"}:
            </b>{" "}
            <span style={{ whiteSpace: "pre-line" }}>{m.content}</span>
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>Dobby is typing...</div>}
      </div>

      <form onSubmit={handleSend} style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the latest crypto news..."
          style={{ flex: 1, padding: "8px 10px", fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
