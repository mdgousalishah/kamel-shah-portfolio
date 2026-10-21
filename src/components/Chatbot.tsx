import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, RotateCcw, MessageCircle } from 'lucide-react';
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
      text: "Hi! I'm the portfolio assistant for Kamel Shah (Mohammed Gous Ali Shah). Feel free to ask about his experience, projects, skills, education, or contact details."
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
    } catch {
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
    setMessages([{
      id: 'welcome',
      type: 'bot',
      text: "Hi! I'm the portfolio assistant for Kamel Shah. Ask me about his projects, skills, experience, education, or contact details."
    }]);
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
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block mb-1 last:mb-0">
          {parts.map((part, j) => {
            if (j % 2 === 1) return <strong key={j} className="font-semibold text-ink">{part}</strong>;
            const trimmed = part.trim();
            const leadingSpace = part.slice(0, part.indexOf(trimmed));
            const link = trimmed.match(/^(https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})([.,!?;:]*)$/);
            if (link) {
              const href = link[1].startsWith('http') ? link[1] : `mailto:${link[1]}`;
              return (
                <span key={j}>
                  {leadingSpace}
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="break-all text-ink-soft underline underline-offset-2 hover:text-ink"
                  >
                    {link[1]}
                  </a>
                  {link[2]}
                </span>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Chatbot toggle — standard chat-bubble icon, restrained charcoal treatment */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-ivory shadow-[0_8px_24px_-10px_rgba(36,36,36,0.55)] transition-[opacity,transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink-soft ${
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Open Kamel AI assistant"
        aria-expanded={isOpen}
        title="Ask Kamel's assistant"
      >
        <MessageCircle size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            role="dialog"
            aria-label="Kamel AI assistant"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-[370px] h-[min(520px,calc(100dvh-80px))] bg-paper border border-line rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-sand">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-paper rounded-full flex items-center justify-center border border-line">
                  <MessageCircle size={15} className="text-ink" />
                </div>
                <div>
                  <h3 className="text-ink font-serif text-base leading-tight">Kamel Assistant</h3>
                  <p className="text-muted text-[11px] tracking-wide">Portfolio guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={startNewChat}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-line/50 text-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label="Start a new chat"
                  title="New chat"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-line/50 text-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label="Close Kamel AI assistant"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              aria-live="polite"
              aria-relevant="additions text"
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-sand border border-line text-ink text-xs mt-auto">
                      {msg.type === 'bot' ? <MessageCircle size={12} /> : <User size={12} />}
                    </div>

                    <div
                      className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                        msg.type === 'user' 
                          ? 'bg-ink text-paper rounded-br-xs' 
                          : 'bg-sand border border-line text-ink rounded-bl-xs'
                      } break-words`}
                    >
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-sand border border-line text-ink text-xs mt-auto">
                      <MessageCircle size={12} />
                    </div>
                    <div role="status" className="p-3 rounded-xl rounded-bl-xs bg-sand border border-line flex items-center gap-1.5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-ink rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-ink rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-ink rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions (only when fresh chat) */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {INITIAL_SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-left text-xs text-ink bg-sand/70 hover:bg-sand border border-line p-2 rounded-lg transition-colors cursor-pointer"
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
              className="p-3 border-t border-line bg-sand"
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
                  placeholder={isTyping ? 'Thinking…' : 'Ask a question…'}
                  className="w-full bg-paper text-ink text-xs sm:text-sm placeholder:text-muted/70 rounded-full pl-3.5 pr-10 py-2.5 border border-line focus:outline-none focus:border-ink transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 w-7 h-7 flex items-center justify-center bg-ink rounded-full text-paper hover:bg-ink-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send size={12} />
                </button>
              </div>
            </form>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
