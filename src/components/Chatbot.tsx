import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { chatWithAI } from '../services/aiService';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
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

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: input }]
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts
    }));

    const responseText = await chatWithAI(input, history);
    
    setMessages(prev => [...prev, {
      role: 'model',
      parts: [{ text: responseText }]
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[380px] h-[520px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-slate p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
                  <Bot size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="text-sm font-black tracking-widest uppercase">HelpHub AI</h4>
                    <p className="text-[10px] text-brand-teal font-bold uppercase tracking-tighter">Community Agent Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-cream/20">
              {messages.length === 0 && (
                <div className="text-center py-10 px-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4 text-brand-teal border border-black/5">
                        <MessageSquare size={24} />
                    </div>
                    <p className="text-brand-slate font-bold text-sm mb-1">Establish Connection</p>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Ask me about community signals, how to improve your requests, or help with finding resources.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-slate text-white rounded-br-none font-medium' 
                      : 'bg-white text-brand-slate border border-black/5 rounded-bl-none font-bold shadow-sm'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-black/5 shadow-sm">
                    <Loader2 className="animate-spin text-brand-teal" size={16} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-black/5">
                <div className="flex gap-2 bg-brand-cream rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                    <input 
                        type="text" 
                        placeholder="Pulse a message..."
                        className="flex-1 px-3 py-2 bg-transparent outline-none text-sm font-semibold text-brand-slate"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-brand-teal text-white p-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-brand-teal/20"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-slate text-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-teal opacity-0 group-hover:opacity-20 transition-opacity"></div>
        {isOpen ? <Minimize2 size={24} /> : <div className="relative"><MessageSquare size={24} /><span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-teal rounded-full animate-pulse border-2 border-brand-slate"></span></div>}
      </button>
    </div>
  );
};
