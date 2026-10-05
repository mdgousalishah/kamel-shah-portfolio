import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, MessageCircle } from 'lucide-react';
import { getChatbotResponse } from '../data/chatbotKnowledge';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
}

const INITIAL_SUGGESTIONS = [
  "Who is Kamel Shah?",
  "What projects has he built?",
  "What are his strongest skills?",
  "Tell me about his experience."
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      text: "Hi! I'm Kamel AI, the portfolio assistant for Mohammed Gous Ali Shah. Ask me about his experience, projects, skills, education, certifications, or services."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small timeout to allow animation to complete
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay for AI response
    setTimeout(() => {
      const responseText = getChatbotResponse(text);
      const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'bot', text: responseText };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600); // 600ms delay feels natural
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatMessage = (text: string) => {
    // Simple formatting for bold text (e.g., **Project**)
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block mb-1 last:mb-0">
          {parts.map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="font-semibold text-white">{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <>
      {/* Chatbot Toggle Button — Clean 48px AI Assistant (Chat Bubble + Sparkle) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#12131A]/95 hover:bg-[#1A1B26] backdrop-blur-xl border border-white/15 hover:border-indigo-400/60 text-white shadow-2xl flex items-center justify-center transition-all duration-200 z-40 group hover:scale-105 active:scale-95 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Chat with Kamel AI Assistant"
        title="Chat with Kamel AI Assistant"
      >
        <svg
          className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Crisp chat bubble */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          {/* AI 4-point star inside the bubble */}
          <path d="M12.5 7.5c0 1.2.8 1.8 1.8 1.8-1 0-1.8.6-1.8 1.8 0-1.2-.8-1.8-1.8-1.8 1 0 1.8-.6 1.8-1.8z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-[380px] h-[550px] max-h-[calc(100vh-100px)] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/5">
                  <Sparkles size={18} className="text-[#EDEDED]" />
                </div>
                <div>
                  <h3 className="text-[#EDEDED] font-bold text-sm">Kamel AI</h3>
                  <p className="text-[#A3A3A3] text-xs font-mono uppercase tracking-widest">Ask me about Kamel Shah</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[#A3A3A3] hover:text-white"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mt-auto">
                      {msg.type === 'bot' ? <Sparkles size={14} className="text-[#A3A3A3]" /> : <User size={14} className="text-[#A3A3A3]" />}
                    </div>

                    <div 
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.type === 'user' 
                          ? 'bg-white/10 text-[#EDEDED] rounded-br-sm' 
                          : 'bg-[#1A1A1A] border border-white/5 text-[#A3A3A3] rounded-bl-sm'
                      }`}
                    >
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mt-auto">
                      <Sparkles size={14} className="text-[#A3A3A3]" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-bl-sm bg-[#1A1A1A] border border-white/5 flex items-center gap-1.5">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions (only show if it's just the initial welcome message) */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-col gap-2 mt-2">
                  {INITIAL_SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-left text-xs text-[#A3A3A3] hover:text-[#EDEDED] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-2.5 rounded-xl transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="w-full bg-[#1A1A1A] text-[#EDEDED] text-sm placeholder:text-[#A3A3A3]/50 rounded-full pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send Message"
                >
                  <Send size={14} className={inputValue.trim() ? "translate-x-[-1px]" : ""} />
                </button>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
