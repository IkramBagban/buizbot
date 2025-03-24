"use client";
import React, { useEffect, useState } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const sendMessage = () => {
    if (!message.trim() || !ws) return console.log("message or ws is null");

    ws.send(
      JSON.stringify({
        type: "CHAT",
        payload: {
          room_id: roomId,
          message,
        },
      })
    );
    setMessage("");
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to websocket");
      const room_id = prompt("Enter room_id to connect to the room.");

      if (room_id) {
        setRoomId(room_id);
        ws.send(JSON.stringify({ type: "JOIN", payload: { room_id } }));
      }
      setWs(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, data.message])
      console.log();
    };

    return () => ws.close()
  }, []);

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar */}
      <aside className="w-2/10 border-r p-6 bg-gray-100 flex flex-col">
        <h2 className="text-lg font-semibold">Chat Rooms</h2>
        <p className="text-sm text-gray-600 mt-2">
          Select a chat room to start messaging.
        </p>
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
