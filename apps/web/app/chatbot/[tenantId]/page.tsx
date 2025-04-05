"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Send } from "lucide-react";
import { ChatMessage, MessageType, UserRole } from "@repo/common/types";
import { useParams } from "next/navigation";
// import './styles.css';

const LOCAL_STORAGE_KEY = "buizbotUser";
const wsUrl = "ws://localhost:8080";
const Chatbot = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ email: "", name: "" });
  const [showForm, setShowForm] = useState(false);
  const params = useParams();
  console.log("params", params);

  console.log("tenantId", params.tenantId);

  const joinUser = ({
    ws,
    type,
    role,
    payload,
  }: {
    ws: WebSocket;
    type: MessageType;
    role: UserRole;
    payload: any;
  }) => {
    ws.send(JSON.stringify({ type, role, payload }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Socket connected");
      if (storedUser) {
        console.log("stored user", storedUser);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsOpen(true);
        joinUser({
          ws,
          type: "JOIN",
          role: "USER",
          payload: { email: parsedUser.email, name: parsedUser.name,  tenantId: params.tenantId as string , USER: parsedUser.email},
        });
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("data", data);
        if (data.type === "CHAT") {
          setMessageHistory((prev: ChatMessage[]): ChatMessage[] => [
            ...prev,
            data.payload,
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("Socket connection closed");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);
    return () => ws.close();
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(true);
    if (!user.email) setShowForm(true);
  }, [user.email]);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!user.email || !user.name || !socket) return;

      console.log("User Details:", { email: user.email, name: user.name });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      setShowForm(false);

      joinUser({
        ws: socket,
        type: "JOIN",
        role: "USER",
        payload: { email: user.email, name: user.name,  tenantId: params.tenantId as string, USER: user.email },
      });
    },
    [user, socket, params.tenantId]
  );

  const sendMessage = useCallback(() => {
    if (!socket || !messageInput.trim() || !user.email) {
      console.log("Cannot send message: missing socket, message, or email");
      return;
    }

    const payload: ChatMessage & { roomId: string; tenantId: string } = {
      roomId: user.email,
      tenantId: params.tenantId as string ,
      content: messageInput,
      timestamp: Date.now(),
      senderId: user.email,
      recipientId: "ADMIN",
      direction: "out",
    };

    setMessageHistory((prev: ChatMessage[]): ChatMessage[] => [
      ...prev,
      payload,
    ]);

    socket.send(
      JSON.stringify({
        type: "CHAT",
        payload,
      })  
    );
    setMessageInput("");
  }, [socket, messageInput, user, params.tenantId]);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none">
      <button
        onClick={toggleChat}
        className="pointer-events-auto absolute bottom-8 right-8 bg-gradient-to-r from-[#00f5d4] to-[#9b5de5] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 animate-[pulseGlow_1.5s_infinite] cursor-pointer"
      >
        Chat Now
      </button>

      <div
        className={`pointer-events-auto absolute bottom-16 right-8 w-[30rem] h-[35rem] glass rounded-xl shadow-2xl transition-all duration-500 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-10"}`}
      >
        <div className="flex flex-col h-full bg-[rgba(10,10,10,0.9)]">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white p-2 text-sm self-end hover:text-[#00f5d4] transition-colors duration-300"
          >
            Close
          </button>

          {user.email && !showForm ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messageHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className="glass p-3 rounded-lg text-white animate-[slideUp_0.3s_ease-out]"
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[rgba(0,245,212,0.2)]">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Write a message..."
                    className="flex-1 glass text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f5d4] transition-all duration-300"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-[#00f5d4] text-[#0a0a0a] p-2 rounded-lg hover:bg-[#9b5de5] hover:text-white transition-colors duration-300 animate-[pulseGlow_1.5s_infinite]"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
              <h2 className="text-xl text-[#00f5d4] text-center">
                Welcome! Let&aposs get started.
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                  className="w-full p-3 glass text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f5d4] transition-all duration-300"
                  required
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Your email"
                  className="w-full p-3 glass text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f5d4] transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#00f5d4] text-[#0a0a0a] p-3 rounded-lg hover:bg-[#9b5de5] hover:text-white transition-colors duration-300 animate-[pulseGlow_1.5s_infinite]"
                >
                  Start Chatting
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
