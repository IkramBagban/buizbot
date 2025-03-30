// @ts-nocheck

import { WebSocket, WebSocketServer } from "ws";
import { ChatMessage, ChatRoom, UserRole, WSMessage } from "@repo/common";

const PORT = 8080;
const rooms = new Map<string, Set<WebSocket>>();
const adminConnections = new Set<WebSocket>();
const userMetadata = new Map<string, { name: string; lastActive: number }>();
const messageHistory = new Map<string, ChatMessage[]>();

const wss = new WebSocketServer({ port: PORT });
wss.on("connection", (ws) => {
  console.log('user connected')
  let currentRole: UserRole | null = null;
  let currentUserEmail: string | null = null;

  ws.on("message", (rawData) => {
    try {
      const message = JSON.parse(rawData.toString()) as WSMessage;
      console.log('message',message);

      switch (message.type) {
        case "JOIN":
          handleJoin(ws, message);
          break;

        case "CHAT":
          handleChat(message.payload);
          break;

        case "ROOM_LIST":
          broadcastRoomList();
          break;
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  });

  function handleJoin(ws: WebSocket, msg: WSMessage) {
    currentRole = msg.role;

    if (msg.role === "ADMIN") {
      adminConnections.add(ws);
      broadcastRoomList();
      return;
    }

    if (!msg.payload?.email || !msg.payload.name) {
      ws.close(4001, "Missing user credentials");
      return;
    }

    currentUserEmail = msg.payload.email;
    userMetadata.set(currentUserEmail, {
      name: msg.payload.name,
      lastActive: Date.now(),
    });

    if (!rooms.has(currentUserEmail)) {
      rooms.set(currentUserEmail, new Set());
      messageHistory.set(currentUserEmail, []);
    }
    rooms.get(currentUserEmail)!.add(ws);
    broadcastRoomList();
  }

  function handleChat(payload: ChatMessage & { roomId: string }) {
    console.log('currentRole !== "ADMIN")',currentRole !== "ADMIN")
    if (!currentUserEmail && currentRole !== "ADMIN") return;

    const history = messageHistory.get(payload.roomId) || [];
    history.push(payload);
    messageHistory.set(payload.roomId, history.slice(-100)); // Keep last 100 messages

    const receivers =
      currentRole === "ADMIN"
        ? rooms.get(payload.roomId) || new Set()
        : adminConnections;

    receivers.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "CHAT",
            payload,
          })
        );
      }
    });
  }

  function broadcastRoomList() {
    const roomList: ChatRoom[] = Array.from(rooms.keys()).map((email) => ({
      roomId: email,
      userMetadata: {
        email,
        name: userMetadata.get(email)?.name || "Unknown",
        lastActive: userMetadata.get(email)?.lastActive || Date.now(),
      },
      messageHistory: messageHistory.get(email) || [],
    }));

    adminConnections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "ROOM_LIST",
            payload: roomList,
          })
        );
      }
    });
  }

  ws.on("close", () => {
    if (currentRole === "ADMIN") adminConnections.delete(ws);
    if (currentUserEmail) {
      rooms.get(currentUserEmail)?.delete(ws);
      if (rooms.get(currentUserEmail)?.size === 0) {
        rooms.delete(currentUserEmail);
      }
    }
  });
});
