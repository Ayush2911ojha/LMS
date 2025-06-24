"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";




interface ChatMessage {
  from: "user" | "bot";
  text: string;
  time: string;
}

const ChatbotPanel = ({ onClose }: { onClose: () => void }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  async function sendMessage(message: string) {
    setLoading(true);
    setMessages((prev) => [...prev, { from: "user", text: message, time: getCurrentTime() }]);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: data.text, time: getCurrentTime() },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Error: " + data.error.message, time: getCurrentTime() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "No response from API.", time: getCurrentTime() },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Error: " + (err as Error).message,
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[540px] bg-gradient-to-br from-white via-indigo-50 to-pink-50 shadow-2xl rounded-2xl flex flex-col z-50 border border-indigo-200 ring-2 ring-pink-200 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-5 rounded-t-2xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 rounded-full p-2">
            <Bot className="w-6 h-6 animate-bounce-slow" />
          </span>
          <h3 className="font-bold text-lg tracking-wide drop-shadow">Your AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white font-bold text-2xl hover:text-pink-200 transition"
          aria-label="Close chat"
        >
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white/80 to-indigo-50/60">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 select-none">
            <Bot className="w-12 h-12 mb-2 text-indigo-400 animate-bounce-slow" />
            <div className="font-semibold text-lg">How can I help you today?</div>
            <div className="text-sm mt-1">Ask me anything about your LMS!</div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div className="bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white/60">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`relative p-3 rounded-2xl max-w-[75%] whitespace-pre-wrap text-sm leading-relaxed shadow-md transition-all duration-300 ${
                msg.from === "user"
                  ? "bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-100 text-right border border-indigo-100"
                  : "bg-white/90 border border-pink-100 text-left"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
              {/* Bubble tail */}
              <span
                className={`absolute ${
                  msg.from === "user"
                    ? "right-[-8px] bottom-2 border-l-[8px] border-l-indigo-200 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                    : "left-[-8px] bottom-2 border-r-[8px] border-r-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                }`}
              ></span>
            </div>

            {msg.from === "user" && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white/60 font-bold">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-center gap-2 justify-start">
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white/60">
              <Bot size={18} />
            </div>
            <div className="bg-white/90 border border-pink-100 text-sm rounded-2xl px-4 py-2 animate-pulse shadow-md flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></span>
              <span className="ml-2">Typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-gradient-to-r from-white via-indigo-50 to-pink-50 rounded-b-2xl flex gap-2 items-center"
      >
        <input
          type="text"
          className="flex-1 border border-indigo-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition bg-white/80 shadow"
          placeholder={loading ? "Waiting for response..." : "Type your message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 hover:from-indigo-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center gap-1"
        >
          <MessageCircle className="w-5 h-5" />
          Send
        </button>
      </form>
      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export const ChatBotButton = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Trigger pulse and sparkle animation every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1500); // Animation lasts 1.5 seconds
    }, 8000); // 8-second interval
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setChatOpen((v) => !v)}
          className={`relative bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            pulse ? "animate-pulse-glow" : ""
          }`}
          title="Chat with LMS Assistant"
          aria-label="Chat with LMS Assistant"
        >
          <Bot className="h-8 w-8 animate-bounce-slow" />
            {/* Sparkle effect */}
            <div className={`absolute inset-0 ${pulse ? "animate-sparkle" : ""}`}>
            <span className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-0" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-600 rounded-full opacity-0" />
            <span className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-500 rounded-full opacity-0" />
            <span className="absolute bottom-1/2 right-1/2 w-2 h-2 bg-indigo-600 rounded-full opacity-0" />
            </div>
          {/* Glow effect */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 hover:opacity-30 transition-opacity duration-500"></span>
        </button>
      </div>

      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 15px 5px rgba(192, 38, 211, 0.5);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
        }
        @keyframes sparkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out;
        }
        .animate-sparkle span {
          animation: sparkle 1.5s ease-in-out;
        }
        .animate-sparkle span:nth-child(1) {
          transform: translate(-10px, -10px);
          animation-delay: 0.2s;
        }
        .animate-sparkle span:nth-child(2) {
          transform: translate(10px, 10px);
          animation-delay: 0.4s;
        }
        .animate-sparkle span:nth-child(3) {
          transform: translate(-5px, 5px);
          animation-delay: 0.6s;
        }
      `}</style>
    </>
  );
};
