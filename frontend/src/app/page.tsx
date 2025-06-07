"use client";
import { useState, KeyboardEvent } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const askAI = async (): Promise<void> => {
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      // Add user's message first
      setMessages((prev) => [...prev, { role: "user", content: input }]);

      const res = await axios.post<{ reply: string }>("http://localhost:8000/ask", {
        message: input,
      });

      // Add AI response
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (error) {
      console.error("Error asking AI:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error: Failed to get response from AI." }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">AI Assistant</h1>
        
        {/* Chat container */}
        <div className="flex-1 flex flex-col bg-black outline text-white rounded-xl shadow-md overflow-hidden mb-4">
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-lg">How can I help you today?</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
                    >
                      <div className="font-semibold text-sm mb-1">
                        {msg.role === "user" ? "You" : "AI"}
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t rounded-md border-gray-200 p-4 bg-gray-400">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border border-gray-300 bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                onClick={askAI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        
        <footer className="text-center text-white text-xs mt-4">
          AI Assistant may produce inaccurate information about people, places, or facts.
        </footer>
      </div>
    </main>
  );
}