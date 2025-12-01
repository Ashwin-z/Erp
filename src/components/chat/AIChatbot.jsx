import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, X, Send, Loader2, Sparkles, 
  ThumbsUp, ThumbsDown, User, Bot, Minimize2,
  Maximize2, HelpCircle, CreditCard, Zap, BookOpen
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

const quickPrompts = [
  { icon: HelpCircle, label: 'How does AI reconciliation work?', category: 'features' },
  { icon: CreditCard, label: 'What are the pricing plans?', category: 'pricing' },
  { icon: Zap, label: 'How to get started?', category: 'onboarding' },
  { icon: BookOpen, label: 'Show me GST compliance features', category: 'compliance' }
];

const systemContext = `You are ARKFinex AI Assistant, a helpful chatbot for the ARKFinex finance automation platform. 

About ARKFinex:
- Enterprise-grade finance automation for Singapore and Asia
- Key features: AI-powered bank reconciliation (95% accuracy), predictive cashflow forecasting (90 days), OCR invoice processing, IRAS GST compliance, multi-client agency management
- Pricing: Entry ($49/mo - 10 clients), Growth ($199/mo - 50 clients), Enterprise (custom)
- Singapore-first with PDPA compliance, SOC 2 Type II certified

When answering:
- Be concise, friendly, and professional
- Focus on Singapore/Asia market context
- Highlight AI capabilities when relevant
- Guide users to relevant features
- For complex queries, suggest booking a demo`;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m ARKFinex AI Assistant. How can I help you today? 👋' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-6).map(m => 
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      ).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemContext}

Previous conversation:
${conversationHistory}

User: ${text}

Provide a helpful, concise response:`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an issue. Please try again or contact support@arkfinex.com for assistance.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageIndex, helpful) => {
    // In production, this would save feedback
    setMessages(prev => prev.map((m, i) => 
      i === messageIndex ? { ...m, feedback: helpful } : m
    ));
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-lime-500 to-emerald-500 rounded-full shadow-lg shadow-lime-500/30 flex items-center justify-center text-slate-900 hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${
        isExpanded 
          ? 'bottom-4 right-4 left-4 top-4 md:left-auto md:top-auto md:w-[500px] md:h-[700px]' 
          : 'bottom-6 right-6 w-96 h-[550px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h3 className="font-semibold">ARKFinex AI</h3>
            <p className="text-xs text-slate-400">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[calc(100%-140px)] p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-slate-200' 
                  : 'bg-gradient-to-br from-lime-400 to-emerald-500'
              }`}>
                {message.role === 'user' 
                  ? <User className="w-4 h-4 text-slate-600" />
                  : <Bot className="w-4 h-4 text-slate-900" />
                }
              </div>
              <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-4 py-2.5 max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {message.role === 'assistant' ? (
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none prose-p:my-1">
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
                {message.role === 'assistant' && i > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => handleFeedback(i, true)}
                      className={`p-1 rounded ${message.feedback === true ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleFeedback(i, false)}
                      className={`p-1 rounded ${message.feedback === false ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-900" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-slate-500 font-medium">Quick questions:</p>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt.label)}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-lime-300 hover:bg-lime-50 transition-colors text-left text-sm"
              >
                <prompt.icon className="w-4 h-4 text-lime-600" />
                <span className="text-slate-700">{prompt.label}</span>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-lime-500 hover:bg-lime-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}