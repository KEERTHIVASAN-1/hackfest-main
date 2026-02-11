import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { GrootChatIcon } from './GrootModel';

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am HackFest AI. Ask me anything about the event or the app.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const toggleOpen = () => setOpen((o) => !o);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await apiClient.post('/ai/chat', {
        message: text,
        history: messages
      });
      const aiText = res?.message ?? 'I could not generate a reply right now.';
      setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again in a moment.' }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          aria-label="Open AI chat"
          onClick={toggleOpen}
          className="relative h-24 w-24 rounded-full bg-primary/70 border-2  border-primary/600 shadow-lg overflow-hidden flex items-center justify-center"
        >
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-800 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">
            AI
          </span>
          <div className="mt-3 pointer-events-none">
            <GrootChatIcon />
          </div>
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[90vw] sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">HackFest AI</span>
            </div>
            <button
              onClick={toggleOpen}
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-black'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-black border border-primary hover:bg-white hover:text-primary transition-colors disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="text-sm font-medium">{sending ? 'Sending' : 'Send'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
