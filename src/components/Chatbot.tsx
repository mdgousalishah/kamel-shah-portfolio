import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, User, RotateCcw } from 'lucide-react';
import { getChatbotResponse } from '../data/chatbotKnowledge';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  mode?: 'ai' | 'knowledge';
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
  const requestControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  useEffect(() => () => {
    requestControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleSendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: question };
    const history = [...messages.slice(-10), userMsg].map((message) => ({
      role: message.type === 'bot' ? 'assistant' as const : 'user' as const,
      text: message.text,
    }));
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Assistant request failed (${response.status}).`);
      const result = await response.json() as { text?: string; mode?: 'ai' | 'knowledge' };
      if (!result.text?.trim()) throw new Error('Assistant returned an empty response.');
      setMessages(prev => [...prev, {
        id: `${Date.now()}-bot`,
        type: 'bot',
        text: result.text!.trim(),
        mode: result.mode === 'ai' ? 'ai' : 'knowledge',
      }]);
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessages(prev => [...prev, {
        id: `${Date.now()}-bot`,
        type: 'bot',
        text: getChatbotResponse(question),
        mode: 'knowledge',
      }]);
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsTyping(false);
      }
    }
  };

  const startNewChat = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setMessages([{ id: 'welcome', type: 'bot', text: "Hi! I'm Kamel AI. Ask me about Kamel's projects, skills, experience, education, services, or contact details." }]);
    setInputValue('');
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
          {parts.map((part, j) => {
            if (j % 2 === 1) return <strong key={j} className="font-semibold text-white">{part}</strong>;
            const trimmed = part.trim();
            const leadingSpace = part.slice(0, part.indexOf(trimmed));
            const link = trimmed.match(/^(https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})([.,!?;:]*)$/);
            if (link) {
              const href = link[1].startsWith('http') ? link[1] : `mailto:${link[1]}`;
              return <span key={j}>{leadingSpace}<a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="break-all text-indigo-300 underline decoration-indigo-300/40 underline-offset-2 hover:text-indigo-200">{link[1]}</a>{link[2]}</span>;
            }
            return part;
          })}
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
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-[380px] h-[min(550px,calc(100dvh-80px))] max-h-[calc(100dvh-80px)] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
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
                onClick={startNewChat}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[#A3A3A3] hover:text-white"
                aria-label="Start a new chat"
                title="New chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[#A3A3A3] hover:text-white"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div aria-live="polite" aria-relevant="additions text" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                      } break-words`}
                    >
                      {formatMessage(msg.text)}
                      {msg.type === 'bot' && msg.mode && (
                        <span className="mt-2 block text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                          {msg.mode === 'ai' ? 'Gemini AI' : 'Portfolio knowledge'}
                        </span>
                      )}
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
                    <div role="status" className="p-4 rounded-2xl rounded-bl-sm bg-[#1A1A1A] border border-white/5 flex items-center gap-1.5">
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
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-4 border-t border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  aria-label="Ask Kamel AI a question"
                  placeholder={isTyping ? 'Kamel AI is thinking…' : 'Ask a question…'}
                  className="w-full bg-[#1A1A1A] text-[#EDEDED] text-sm placeholder:text-[#A3A3A3]/50 rounded-full pl-4 pr-12 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send Message"
                >
                  <Send size={14} className={inputValue.trim() ? "translate-x-[-1px]" : ""} />
                </button>
              </div>
            </form>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
