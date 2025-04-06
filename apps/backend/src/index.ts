import { WebSocketServer } from "ws";
import ChatManager from "./chatManager";
import { PORT } from "./constants";

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  new ChatManager(ws);
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
