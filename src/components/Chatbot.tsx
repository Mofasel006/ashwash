import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageCircle, HelpCircle, HeartHandshake, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatbotProps {
  onClose?: () => void;
  inline?: boolean;
}

const PRE_SEEDED_PROMPTS = [
  "I am feeling motherly guilt.",
  "I have a sudden panic wave.",
  "I can't fall asleep tonight.",
  "How can I manage work burnout?"
];

export default function Chatbot({ onClose, inline = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello, dear soul. I am your Ashwash digital companion. Whatever leaves you feeling anxious or heavy today, you can express it here in complete safety. How does your body feel in this very moment?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      // Map history to match the Gemini contents parameter structure if desired, 
      // or simply rely on server side context compilation.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", text: data.response }]);
    } catch (e) {
      console.error("Chat message error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I experienced a temporary network connection break. Please rest assured, take a slow breath, and try sending your thought again whenever you are ready."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "model",
        text: "The chat space is reset. I am here, ready to listen whenever you're ready to share. How can I help support your grounding today?"
      }
    ]);
  };

  return (
    <div className={`flex flex-col bg-white ${inline ? "rounded-[2rem] border border-surface-container h-[550px]" : "rounded-t-[2.5rem] md:rounded-[2.5rem] h-[600px]"} shadow-soft-zen overflow-hidden w-full relative`}>
      {/* Bot Header */}
      <div className="bg-primary text-alabaster-base p-5 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mint-accent/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full bg-sage-calm/25 flex items-center justify-center border border-white/20">
            <HeartHandshake size={20} className="text-mint-accent" />
          </div>
          <div>
            <h3 className="font-headline-md text-base font-semibold leading-tight text-white flex items-center gap-1.5">
              <span>Ashwash Solace Bot</span>
              <span className="inline-block w-2 h-2 rounded-full bg-mint-accent animate-pulse" />
            </h3>
            <p className="text-[10px] text-on-primary-container font-mono tracking-widest uppercase">Compassionate AI</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 z-10">
          <button
            onClick={handleResetChat}
            className="p-2 hover:bg-white/10 rounded-full text-alabaster-base/80 hover:text-white transition-all"
            title="Reset Conversation"
          >
            <RefreshCw size={16} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full text-alabaster-base/80 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background no-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-md leading-relaxed whitespace-pre-line shadow-sm border ${
                msg.role === "user"
                  ? "bg-deep-pine text-white border-transparent rounded-tr-none"
                  : "bg-white text-deep-pine border-surface-container rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-deep-pine border border-surface-container rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pre-seeded Prompt Suggestion Chips */}
      {messages.length === 1 && (
        <div className="px-5 py-3 border-t border-surface-container/50 bg-background flex flex-col gap-2">
          <p className="text-xs text-secondary font-semibold flex items-center gap-1">
            <HelpCircle size={12} className="text-therapeutic-terracotta" />
            <span>Struggling to express? Try one of these chips:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {PRE_SEEDED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs text-deep-pine bg-sage-calm/30 hover:bg-sage-calm px-3 py-1.5 rounded-full font-medium transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-surface-container bg-white flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          placeholder="Share your heavy thoughts safely..."
          className="flex-1 bg-surface-container-lowest border-none px-4 py-3.5 rounded-full text-body-md text-deep-pine placeholder-secondary/60 focus:ring-2 focus:ring-therapeutic-terracotta focus:outline-none transition-all"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || loading}
          className="w-12 h-12 rounded-full bg-deep-pine text-white flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-md shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
