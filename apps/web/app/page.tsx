"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">      {/* Header */}
      <Header />

      <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-600/10"></div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-teal-400 mb-4 max-w-3xl leading-tight">
          Transform Customer Support with AI-Powered Chatbots
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          Buizbot: Intelligent, scalable, and personalized support for your business.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button href="/register" variant="primary">Start Free Trial</Button>
          <Button href="/signin" variant="secondary">Sign In</Button>
        </div>
      </section>

      <Section title="Why Buizbot Stands Out">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Intelligent AI Responses"
            description="Resolve queries instantly with AI-driven support powered by advanced language models."
          />
          <FeatureCard
            title="Train with Your Data"
            description="Customize the chatbot by uploading your business data for tailored responses."
          />
          <FeatureCard
            title="Seamless Agent Transfers"
            description="Switch to a human agent on demand for personalized support."
          />
          <FeatureCard
            title="Insightful Analytics"
            description="Track users, messages, and response times with powerful stats."
          />
        </div>
      </Section>

      <Section title="Trusted by Businesses Worldwide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="— Sarah M., E-commerce Owner"
            description="Buizbot’s AI handles queries, and agents step in seamlessly—amazing support!"
            author
          />
          <FeatureCard
            title="— John D., Tech Startup CEO"
            description="Training with our data made the chatbot spot-on. Highly recommend!"
            author
          />
          <FeatureCard
            title="— Emily R., Marketing Manager"
            description="The analytics dashboard optimizes our support strategy perfectly."
            author
          />
        </div>
      </Section>

      <Section background className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400 mb-4">
          Ready to Revolutionize Your Support?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
          Join thousands of businesses using Buizbot for intelligent, scalable support.
        </p>
        <Button href="/register" variant="primary">Get Started Now</Button>
      </Section>

      <Footer />
    </div>
  );
};

export default Landing;

// // @ts-nocheck
// "use client";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { ArrowDown } from "lucide-react";
// import { signIn } from "next-auth/react";

// export default function AdminChat() {
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState<string>();
//   const [inputMessage, setInputMessage] = useState("");
//   const wsRef = useRef<WebSocket>(null);
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = useCallback(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8080");
//     wsRef.current = ws;

//     ws.onopen = () => {
//       ws.send(JSON.stringify({ type: "JOIN", role: "ADMIN" }));
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log("message", message);

//       if (message.type === "ROOM_LIST") {
//         setRooms(message.payload);
//       } else if (message.type === "CHAT") {
//         setRooms((prev) =>
//           prev.map((room) =>
//             room.roomId === message.payload.roomId
//               ? {
//                   ...room,
//                   messageHistory: [...room.messageHistory, message.payload],
//                 }
//               : room
//           )
//         );
//       }
//     };

//     return () => ws.close();
//   }, []);

//   const sendMessage = useCallback(() => {
//     if (!inputMessage.trim() || !selectedRoom || !wsRef.current) return;

//     const payload = {
//       roomId: selectedRoom,
//       content: inputMessage,
//       timestamp: Date.now(),
//       direction: "out" as const,
//       senderId: "ADMIN",
//       recipientId: selectedRoom,
//     };
//     console.log("send", { type: "CHAT", payload });
//     wsRef.current.send(JSON.stringify({ type: "CHAT", payload }));
//     setInputMessage("");
//   }, [inputMessage, selectedRoom]);

//   const currentRoom = rooms.find((r) => r.roomId === selectedRoom);

//   return (
//     <div className="flex h-screen">
//       <button onClick={() => signIn()}>Signin</button>
//       <div className="w-80 border-r p-4 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Active Chats</h2>
//         {rooms.map((room) => (
//           <button
//             key={room.roomId}
//             onClick={() => setSelectedRoom(room.roomId)}
//             className={`w-full text-left p-3 mb-2 rounded ${
//               selectedRoom === room.roomId ? "bg-blue-100" : "hover:bg-gray-100"
//             }`}
//           >
//             <div className="font-medium">{room.userMetadata.name}</div>
//             <div className="text-sm text-gray-600">{room.roomId}</div>
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-4">
//           {currentRoom?.messageHistory.map((msg, i) => (
//             <div
//               key={i}
//               className={`mb-4 p-3 rounded-lg max-w-[70%] ${
//                 msg.direction === "out"
//                   ? "ml-auto bg-blue-500 text-white"
//                   : "bg-gray-100"
//               }`}
//             >
//               <div className="text-sm">{msg.content}</div>
//               <div className="text-xs mt-1 opacity-70">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </div>
//             </div>
//           ))}
//           <div ref={messageEndRef} />
//         </div>

//         <ArrowDown onClick={scrollToBottom} />

//         <div className="border-t p-4">
//           <div className="flex gap-2">
//             <input
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//               className="flex-1 p-2 border rounded"
//               disabled={!selectedRoom}
//             />
//             <button
//               onClick={sendMessage}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//               disabled={!selectedRoom}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
