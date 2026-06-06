import { useState, useRef, useEffect } from 'react';

const WELCOME = 'Hello! I\'m the SR Constructions assistant. Ask me about our projects, locations, or availability — I\'m happy to help!';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, {
        role: 'assistant',
        content: data.reply || 'Sorry, I couldn\'t process that. Please try again.',
      }]);
    } catch {
      setMessages([...updated, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please call us at +91 99088 34499.',
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={s.wrap}>
      {open && (
        <div style={s.panel}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.avatar}><i className="fa fa-hard-hat"></i></div>
              <div>
                <div style={s.headerTitle}>SR Constructions</div>
                <div style={s.headerSub}>
                  <span style={s.dot}></span> AI Assistant
                </div>
              </div>
            </div>
            <button style={s.closeBtn} onClick={() => setOpen(false)}>
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div style={s.messages}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === 'user' ? s.userRow : s.botRow}>
                {m.role === 'assistant' && <div style={s.botAvatar}><i className="fa fa-hard-hat" style={{ fontSize: 10 }}></i></div>}
                <div style={m.role === 'user' ? s.userBubble : s.botBubble}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={s.botRow}>
                <div style={s.botAvatar}><i className="fa fa-hard-hat" style={{ fontSize: 10 }}></i></div>
                <div style={s.botBubble}>
                  <span style={s.typing}>
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about projects, locations…"
              disabled={loading}
              autoFocus
            />
            <button
              style={input.trim() && !loading ? s.sendBtn : s.sendBtnDisabled}
              onClick={send}
              disabled={!input.trim() || loading}
            >
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button style={s.fab} onClick={() => setOpen((o) => !o)} aria-label="Chat with us">
        <i className={`fa fa-${open ? 'times' : 'comments'}`} style={{ fontSize: 22 }}></i>
      </button>
    </div>
  );
}

const s = {
  wrap: {
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12,
  },
  fab: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #b8943f, #d4af5a)',
    border: 'none', color: '#0e0e0e', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(184,148,63,.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  panel: {
    width: 340, height: 480,
    background: '#141414',
    border: '1px solid rgba(184,148,63,.25)',
    borderRadius: 12,
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 40px rgba(0,0,0,.6)',
    overflow: 'hidden',
    animation: 'fadeUp 0.2s ease',
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a1a, #222)',
    borderBottom: '1px solid rgba(184,148,63,.2)',
    padding: '14px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(184,148,63,.15)',
    border: '1px solid rgba(184,148,63,.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#b8943f', fontSize: 14,
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 14,
    fontWeight: 700, color: '#f5f0e8',
  },
  headerSub: {
    fontSize: 11, color: '#888',
    display: 'flex', alignItems: 'center', gap: 5, marginTop: 2,
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#7de89a', display: 'inline-block',
  },
  closeBtn: {
    background: 'none', border: 'none', color: '#666',
    cursor: 'pointer', fontSize: 14, padding: 4,
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: '16px 14px',
    display: 'flex', flexDirection: 'column', gap: 12,
    scrollbarWidth: 'thin', scrollbarColor: '#333 transparent',
  },
  botRow: { display: 'flex', alignItems: 'flex-end', gap: 7 },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  botAvatar: {
    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(184,148,63,.15)', border: '1px solid rgba(184,148,63,.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8943f',
  },
  botBubble: {
    background: '#1e1e1e', border: '1px solid rgba(255,255,255,.07)',
    color: '#d0c8b8', fontSize: 13, lineHeight: 1.6,
    padding: '10px 13px', borderRadius: '0 12px 12px 12px',
    maxWidth: '85%',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #b8943f, #c9a94e)',
    color: '#0e0e0e', fontSize: 13, lineHeight: 1.6, fontWeight: 500,
    padding: '10px 13px', borderRadius: '12px 0 12px 12px',
    maxWidth: '85%',
  },
  typing: {
    display: 'inline-flex', gap: 4, alignItems: 'center',
  },
  inputRow: {
    display: 'flex', gap: 8, padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,.06)',
    background: '#111',
  },
  input: {
    flex: 1, background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8', fontSize: 13,
    padding: '10px 14px', outline: 'none', borderRadius: 8,
    fontFamily: 'Barlow, sans-serif',
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
    background: '#b8943f', border: 'none', color: '#0e0e0e',
    cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: {
    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
    background: '#2a2a2a', border: 'none', color: '#555',
    cursor: 'not-allowed', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
