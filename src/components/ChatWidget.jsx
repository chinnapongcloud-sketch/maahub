import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';
import './ChatWidget.css';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'สวัสดีครับ ยินดีต้อนรับสู่ KH Arena มีอะไรให้ผมช่วยไหมครับ? สามารถถามเรื่องสนาม เวลาว่าง หรือราคาได้เลยครับ' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const data = await sendChatMessage(userMsg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `ขออภัย: ${err.message}` }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-icon">&#9917;</span>
              <div>
                <strong>KH Arena</strong>
                <span className="chat-online">ออนไลน์</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>&times;</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
                <div className="chat-msg-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="chat-msg-bubble typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์คำถาม..."
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
              &#10148;
            </button>
          </div>
        </div>
      )}

      <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? '&#128172;' : '&#128172;'}
        {!open && <span className="chat-badge" />}
      </button>
    </div>
  );
}
