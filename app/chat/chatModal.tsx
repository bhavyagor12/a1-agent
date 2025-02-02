'use client'
// components/ChatModal.tsx
import { useState, useEffect, useRef } from "react";

export function ChatModal(userId: string) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine if message is from the user by checking its id array
  const isUserMessage = (msg: any) => msg.id.includes("HumanMessage");

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Optimistically add user message
    const userMsg = {
      lc: 1,
      type: "constructor",
      id: ["langchain_core", "messages", "HumanMessage"],
      kwargs: { content: input },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userMessage: input }),
      });
      if (!res.ok) throw new Error("Failed to get response from model");

      const data = await res.json();
      setMessages(data);
      setInput("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          lc: 1,
          type: "error",
          id: ["error"],
          kwargs: { content: "Error sending message. Please try again." },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => {
          const alignment = isUserMessage(msg)
            ? "self-end bg-blue-600"
            : "self-start bg-gray-600";
          return (
            <div
              key={idx}
              className={`px-3 py-2 rounded-lg max-w-[80%] text-white ${alignment}`}
            >
              {msg.kwargs.content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Input area */}
      <div className="flex border-t border-gray-700">
        <input
          type="text"
          className="flex-1 px-3 py-2 bg-gray-700 text-white outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
