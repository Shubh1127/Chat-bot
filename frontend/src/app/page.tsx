"use client";
import { useState,useRef,useEffect, KeyboardEvent } from "react";
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
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom=()=>{
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }
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

  useEffect(()=>{
    scrollToBottom();
  },[messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#202123]">
      <h1 className="text-center my-8 font-bold text-2xl">AI Assistant</h1>
      <div className={`overflow-y-auto ${messages.length===0 ? "h-[25%]" : "h-[80%]"} w-full mb-12 p-4 px-4 md:px-[20vw]`} style={{ scrollBehavior: "smooth" }}>
      {!messages && (
        <p className="text-center text-4xl mt-[12vh]">What can I help with?</p>
      )}
      {messages.map((msg,index)=>{
        return (
          <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-[#343541] text-white p-4 rounded-xl max-w-[90%] md:max-w-md text-left" : "text-white p-4 rounded-xl max-w-[90%] md:max-w-full"}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
      </div>
      <div className="flex mb-8 space-y-4 mx-auto p-4 w-full md:w-auto relative">
        <input 
          value={input} 
          onChange={(e)=>setInput(e.target.value)} 
          onKeyDown={handleKeyDown}  
          placeholder="Type your message..." 
          className="flex-1 border border-gray-300 bg-black text-white rounded-3xl px-4 h-[100px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto pr-16" 
        />
        {/* Mobile-only Send button */}
        <button 
          onClick={askAI} 
          disabled={isLoading} 
          className="md:hidden absolute right-6 bottom-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-lg"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      <footer className="text-center text-gray-200 text-xs mx-4 mb-4">
        AI Assistant may produce inaccurate information about people, places, or facts.
      </footer>
    </div>
  )
}