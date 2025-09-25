import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const messages = newHistory.map(m => ({ role: m.role, content: m.text }));
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const data = await resp.json();
      let assistantText = '';

      if (data.output && Array.isArray(data.output) && data.output[0]?.content) {
        assistantText = data.output[0].content[0]?.text || JSON.stringify(data.output[0].content);
      } else if (data.output_text) {
        assistantText = data.output_text;
      } else if (data.completion) {
        assistantText = data.completion;
      } else {
        assistantText = JSON.stringify(data);
      }

      setHistory(prev => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', text: 'خطأ في الاتصال.' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dobby Chat</h1>
      <div style={{ border: '1px solid #ddd', padding: 12, minHeight: 300 }}>
        {history.map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <b style={{ color: m.role === 'user' ? '#0b5fff' : '#111' }}>
              {m.role === 'user' ? 'You' : 'Dobby'}:
            </b>{' '}
            <span>{m.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Dobby is typing...</div>}
      </div>

      <form onSubmit={handleSend} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك..."
          style={{ flex: 1, padding: '8px 10px', fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          إرسال
        </button>
      </form>
    </div>
  );
}
