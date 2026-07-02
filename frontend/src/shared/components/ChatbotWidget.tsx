"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { text: 'What documents are required?', key: 'docs' },
  { text: 'My SSM registration is expired, what should I do?', key: 'ssm' },
  { text: 'How do I book an inspection?', key: 'inspection' },
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your AI Assistant. How can I help you with your license application today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (text: string): string => {
    const q = text.toLowerCase();
    if (q.includes('document') || q.includes('required') || q.includes('upload') || q.includes('docs')) {
      return 'For the Entertainment License, you must upload: 1) Recent Passport-Sized Photo, 2) Copy of IC/Passport, 3) Business Registration Certificate (SSM), and 4) Tenancy Agreement or Premise Usage Proof. All files are scanned instantly by our AI verification engine.';
    }
    if (q.includes('ssm') || q.includes('expired') || q.includes('business reg')) {
      return 'If your SSM Business Registration is expired, the AI verification engine will flag it. Please upload a current, active SSM profile in the Resubmission View. If you have updated it, make sure the Business Expiry Date matches your new document.';
    }
    if (q.includes('inspection') || q.includes('appointment') || q.includes('calendar') || q.includes('book')) {
      return 'Premises inspections are automatically unlocked once all your documents are verified and approved. Once approved, you can navigate to the "Appointments" page to select your preferred date and time slot from the calendar picker.';
    }
    if (q.includes('tenancy') || q.includes('lease') || q.includes('agreement') || q.includes('mismatch')) {
      return 'Make sure your Tenancy Agreement lists your exact company legal name as the tenant. Legally distinct names (e.g. Kee Food Services vs Kee Food Ventures) will be flagged by our AI scanner. Correcting the name or lease and resubmitting will resolve the issue.';
    }
    return "I'm here to help guide you through the application steps and requirements. Please let me know if you need specific details about SSM registration, Tenancy Agreements, or how to book an inspection appointment!";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getBotResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickQuestion = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white border border-border-muted rounded-xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-slide-up transition-all duration-300">
          {/* Header */}
          <div className="bg-[#1b365d] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success-green animate-pulse" />
              <div>
                <h3 className="text-sm font-bold tracking-tight">AI Assistant</h3>
                <span className="text-[10px] text-slate-300 font-medium">Online &bull; Instant Support</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 flex flex-col">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#1b365d] text-white ml-auto rounded-tr-none'
                    : 'bg-white text-text-main border border-slate-100 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] mt-1 block text-right ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-text-muted'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white border border-slate-100 text-text-muted max-w-[80%] rounded-lg rounded-tl-none p-3 text-xs flex items-center gap-1.5 shadow-sm">
                <span className="font-semibold animate-pulse">Assistant is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Suggested Questions</span>
            <div className="flex flex-col gap-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="text-left text-[11px] text-[#1b365d] bg-white hover:bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 font-medium transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-border-muted flex gap-2 shrink-0 items-center"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 h-9 px-3 bg-slate-50 border border-border-muted rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="h-9 w-9 bg-[#1b365d] hover:bg-opacity-90 disabled:opacity-40 text-white rounded flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1b365d] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group relative"
        aria-label="Toggle Support Chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 rotate-90">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:rotate-12">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-success-green animate-ping" />
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-success-green" />
          </>
        )}
      </button>
    </div>
  );
};
