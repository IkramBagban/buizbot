// @ts-nocheck
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

export default function AdminChat() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [inputMessage, setInputMessage] = useState("");
  const wsRef = useRef<WebSocket>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "JOIN", role: "ADMIN" }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("message", message);

      if (message.type === "ROOM_LIST") {
        setRooms(message.payload);
      } else if (message.type === "CHAT") {
        setRooms((prev) =>
          prev.map((room) =>
            room.roomId === message.payload.roomId
              ? {
                  ...room,
                  messageHistory: [...room.messageHistory, message.payload],
                }
              : room
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim() || !selectedRoom || !wsRef.current) return;

    const payload = {
      roomId: selectedRoom,
      content: inputMessage,
      timestamp: Date.now(),
      direction: "out" as const,
      senderId: "ADMIN",
      recipientId: selectedRoom,
    };
    console.log("send", { type: "CHAT", payload });
    wsRef.current.send(JSON.stringify({ type: "CHAT", payload }));
    setInputMessage("");
  }, [inputMessage, selectedRoom]);

  const currentRoom = rooms.find((r) => r.roomId === selectedRoom);

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Active Chats</h2>
        {rooms.map((room) => (
          <button
            key={room.roomId}
            onClick={() => setSelectedRoom(room.roomId)}
            className={`w-full text-left p-3 mb-2 rounded ${
              selectedRoom === room.roomId ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{room.userMetadata.name}</div>
            <div className="text-sm text-gray-600">{room.roomId}</div>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {currentRoom?.messageHistory.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 p-3 rounded-lg max-w-[70%] ${
                msg.direction === "out"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <ArrowDown onClick={scrollToBottom} />

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded"
              disabled={!selectedRoom}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={!selectedRoom}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}