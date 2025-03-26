import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Send } from 'lucide-react';
import './styles.css';

const Chatbot = ({ wsUrl = 'ws://localhost:8080', chatbotId = 'test123' }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [roomId, setRoomId] = useState(chatbotId);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => console.log('Socket connected');
    ws.onclose = () => console.log('Socket connection closed');
    ws.onerror = () => console.log('There is some error in socket connection');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };
    setSocket(ws);
    return () => ws.close();
  }, [wsUrl]);

  const joinRoom = () => {
    if (!socket) return console.log('Socket is null');
    const room_id = prompt('Enter room id') || chatbotId;
    setRoomId(room_id);
    socket.send(
      JSON.stringify({
        type: 'JOIN',
        payload: { room_id },
      })
    );
    setIsOpen(true);
  };

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return console.log('Socket or message empty');
    socket.send(
      JSON.stringify({
        type: 'CHAT',
        payload: {
          message: messageInput,
          room_id: roomId,
        },
      })
    );
    setMessageInput('');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none">
      <button
        onClick={joinRoom}
        className="pointer-events-auto absolute bottom-8 right-8 bg-[linear-gradient(to_right,#00f5d4,#9b5de5)] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 [animation:pulseGlow_1.5s_infinite]"
      >
        Join Room
      </button>

      <div
        className={`pointer-events-auto absolute bottom-16 right-8 w-[30rem] h-[35rem] glass rounded-xl shadow-2xl transition-all duration-500 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-10'}`}
      >
        <div className="flex flex-col h-full bg-[rgba(10,10,10,0.9)]">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="glass p-3 rounded-lg text-white [animation:slideUp_0.3s_ease-out]"
              >
                {msg}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[rgba(0,245,212,0.2)]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Write a message..."
                className="flex-1 glass text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f5d4] transition-all duration-300"
              />
              <button
                onClick={sendMessage}
                className="bg-[#00f5d4] text-[#0a0a0a] p-2 rounded-lg hover:bg-[#9b5de5] hover:text-white transition-colors duration-300 [animation:pulseGlow_1.5s_infinite]"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mountChatbot = (chatbotId) => {
  const div = document.createElement('div');
  div.id = 'buizbot-chatbot';
  document.body.appendChild(div);
  ReactDOM.render(<Chatbot chatbotId={chatbotId} />, div);
};

window.BuizbotWidget = { init: mountChatbot };
const script = document.currentScript;
const urlParams = new URLSearchParams(script.src.split('?')[1]);
const chatbotId = urlParams.get('chatbotId');
if (chatbotId) mountChatbot(chatbotId);

export default Chatbot;