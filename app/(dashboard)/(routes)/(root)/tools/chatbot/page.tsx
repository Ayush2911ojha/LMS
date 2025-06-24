'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'bot', content: 'Welcome to the LMS Assistant! Ask about courses, assignments, or navigation.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from server');
      }

      const botResponse = data.response || 'Sorry, I could not process your request.';
      setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        console.error('Frontend Error:', (error as any).message);
        errorMessage = (error as any).message;
        if (errorMessage.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait and try again.';
        } else if (errorMessage.includes('403')) {
          errorMessage = 'Authentication failed. Check API key or model access.';
        }
      } else {
        console.error('Frontend Error:', error);
      }
      setMessages((prev) => [...prev, { role: 'bot', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-semibold text-lg">LMS Assistant</div>
        <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-blue-100 ml-8 text-right' : 'bg-green-100 mr-8 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && <div className="text-gray-500 text-center text-sm">Typing...</div>}
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              placeholder="Ask about courses, assignments..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}