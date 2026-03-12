import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2, Image as ImageIcon, Paperclip } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { GrootChatIcon } from './GrootModel';

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am HackFest AI. Ask me anything about the event or the app. You can also upload an image for me to analyze!' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const toggleOpen = () => setOpen((o) => !o);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !selectedImage) || sending) return;

    const userMsg = { 
      role: 'user', 
      content: text || (selectedImage ? 'Analyzed this image' : ''),
      image: imagePreview 
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    removeImage();
    setSending(true);

    try {
      let res;
      if (currentImage) {
        res = await aiApi.analyzeImage(currentImage, text);
      } else {
        res = await aiApi.chat(text, messages.map(m => ({ role: m.role, content: m.content })));
      }
      
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
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
        <button
          aria-label="Open AI chat"
          onClick={toggleOpen}
          className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-primary/30 border-2  border-amber-700 shadow-lg overflow-hidden flex items-center justify-center"
        >
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-800 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">
            AI
          </span>
          <div className="mt-2 sm:mt-3 pointer-events-none">
            <GrootChatIcon />
          </div>
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-2 sm:right-4 z-50 w-[94vw] sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
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

          <div className="h-[50vh] sm:h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[85%] sm:max-w-[80%] text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-black rounded-tr-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {m.image && (
                    <img src={m.image} alt="Uploaded" className="w-full h-auto rounded-md mb-2 max-h-48 object-cover" />
                  )}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white">
            {imagePreview && (
              <div className="relative inline-block mb-3">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                title="Upload image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedImage ? "Describe the image or ask a question..." : "Type your question..."}
                className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              
              <button
                type="submit"
                disabled={sending || (!input.trim() && !selectedImage)}
                className="p-2 rounded-full bg-primary text-black hover:bg-amber-500 transition-colors disabled:opacity-50 shadow-sm"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
