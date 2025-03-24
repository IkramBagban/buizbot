'use client'
import React, { useState } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return; 
    setMessages((prev) => [...prev, message]); 
    setMessage(""); 
  };

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar */}
      <aside className="w-2/10 border-r p-6 bg-gray-100 flex flex-col">
        <h2 className="text-lg font-semibold">Chat Rooms</h2>
        <p className="text-sm text-gray-600 mt-2">Select a chat room to start messaging.</p>
      </aside>

      {/* Chat Main Section */}
      <main className="w-8/10 flex flex-col p-6">
        {/* Chat Header */}
        <header className="border-b pb-3">
          <h1 className="text-xl font-semibold">Chat Room</h1>
        </header>

        <section className="flex-grow overflow-y-auto p-4 bg-gray-50 border rounded-md mt-4 space-y-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="bg-white p-2 rounded shadow border">
                {msg}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet...</p>
          )}
        </section>

        <footer className="mt-4">
          <div className="w-full flex items-center gap-3 border rounded-lg p-3 shadow-md bg-white">
            <input
              type="text"
              className="flex-1 p-3 rounded-md border focus:outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
            />
            <button
              onClick={sendMessage}
              className="w-[8rem] bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
