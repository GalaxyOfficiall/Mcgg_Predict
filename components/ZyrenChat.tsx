import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ZyrenChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Halo! Aku Zyren-Ai, siap ngobrol apa aja sama kamu. Mau tanya soal game atau curhat juga boleh!',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));
      
      const responseText = await generateChatResponse(userMsg.text, history);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Waduh error nih. Coba lagi nanti ya.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
        >
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-white to-pink-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            ZYREN-AI CHAT
            </h1>
            <p className="text-[10px] text-pink-200 mt-1 font-light tracking-widest uppercase">Asisten Virtual-mu</p>
        </motion.div>

      <div className="flex-1 overflow-y-auto p-2 space-y-5 scrollbar-hide pb-24">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-tr from-cyan-400 to-blue-500' : 'bg-gradient-to-tr from-purple-500 to-pink-500'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            
            <div className={`max-w-[80%] p-3 shadow-xl backdrop-blur-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-cyan-500/80 to-blue-600/80 text-white rounded-xl rounded-tr-none border border-cyan-400/30' 
                : 'bg-black/40 text-gray-100 rounded-xl rounded-tl-none border border-white/10'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span className={`text-[9px] block mt-1.5 text-right ${msg.role === 'user' ? 'text-blue-100/70' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
               <Bot size={16} className="text-white" />
             </div>
             <div className="bg-black/40 p-3 rounded-xl rounded-tl-none border border-white/10">
               <div className="flex gap-1.5">
                 <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-2 left-2 right-2 max-w-lg mx-auto z-40">
        <motion.div 
          layout 
          className="bg-glass-dark/90 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-end gap-1.5"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            className="flex-1 w-full bg-transparent text-white placeholder-gray-500 text-sm py-2 px-3 outline-none resize-none max-h-20 scrollbar-hide font-medium"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300 active:scale-95"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ZyrenChat;
