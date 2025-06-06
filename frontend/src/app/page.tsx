"use client";
import { useState } from "react";
import axios from "axios";
export default function Home(){
  const [input,setInput] = useState("");
  const [response,setResponse]=useState("");

  const askAI=async()=>{
    try{

      const res=await axios.post("http://localhost:8000/ask",{
        message: input
      })
      const data=res.data;
      setResponse(data.reply);
    }catch(error){
      console.error("Error asking AI:", error);
      setResponse("An error occurred while asking the AI.");
    }
  }


return (
  <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ask Your AI Agent</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full mb-2"
        placeholder="Type your message..."
      />
      <button
        onClick={askAI}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Ask
      </button>
      <p className="mt-4 text-lg">{
        response ? response : "Your AI's response will appear here."
        }</p>
    </main>
  )
}