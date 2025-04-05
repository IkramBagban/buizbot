// @ts-nocheck

import { WebSocket, WebSocketServer } from "ws";
import { ChatMessage, ChatRoom, UserRole, WSMessage } from "@repo/common";

const PORT = 8080;

const rooms = new Map<string, Set<{ ws: WebSocket; tenantId: string; USER: string }>>();
const adminConnections = new Set<{ ws: WebSocket; tenantId: string }>();
const userMetadata = new Map<
  string,
  { name: string; lastActive: number; tenantId: string }
>();
const messageHistory = new Map<string, ChatMessage[]>();

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("user connected");

  let currentRole: UserRole | null = null;
  let currentUserEmail: string | null = null;
  let currentTenantId: string | null = null;

  ws.on("message", (rawData) => {
    try {
      const message = JSON.parse(rawData.toString()) as WSMessage;
      console.log("message", message);

      switch (message.type) {
        case "JOIN":
          handleJoin(ws, message);
          break;

        case "CHAT":
          handleChat(message.payload);
          break;

        case "ROOM_LIST":
          broadcastRoomList(message.payload.tenantId);
          break;
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  });

  function handleJoin(ws: WebSocket, msg: WSMessage) {
    currentRole = msg.role;
    currentTenantId = msg.payload.tenantId;

    if (msg.role === "ADMIN") {
      adminConnections.add({ ws, tenantId: msg.payload.tenantId });
      broadcastRoomList(msg.payload.tenantId);
      return;
    }

    if (!msg.payload?.email || !msg.payload.name) {
      ws.close(4001, "Missing user credentials");
      return;
    }

    currentUserEmail = msg.payload.email;
    userMetadata.set(currentUserEmail, {
      name: msg.payload.name,
      tenantId: msg.payload.tenantId,
      lastActive: Date.now(),
    });

    if (!rooms.has(currentUserEmail)) {
      rooms.set(currentUserEmail, new Set());
      messageHistory.set(currentUserEmail, []);
    }

    rooms.get(currentUserEmail)!.add({
      ws,
      tenantId: msg.payload.tenantId,
      USER: msg.payload.USER,
    });

    broadcastRoomList(msg.payload.tenantId);
  }

  function handleChat(payload: ChatMessage & { roomId: string }) {
    if (!currentUserEmail && currentRole !== "ADMIN") return;

    const history = messageHistory.get(payload.roomId) || [];
    history.push(payload);
    messageHistory.set(payload.roomId, history.slice(-100)); // Last 100 messages

    const receivers =
      currentRole === "ADMIN"
        ? rooms.get(payload.roomId) || new Set()
        : Array.from(adminConnections).filter(
            (client) => client.tenantId === currentTenantId
          );

    receivers.forEach((client) => {
      const targetWS = currentRole === "ADMIN" ? client.ws : client.ws;

      if (targetWS.readyState === WebSocket.OPEN) {
        targetWS.send(
          JSON.stringify({
            type: "CHAT",
            payload,
          })
        );
      }
    });
  }

  function broadcastRoomList(tenantId: string) {
    const filteredRooms = Array.from(rooms.entries()).filter(([_, connections]) =>
      Array.from(connections).some((c) => c.tenantId === tenantId)
    );

    const roomList: ChatRoom[] = filteredRooms.map(([email]) => ({
      roomId: email,
      userMetadata: {
        email,
        name: userMetadata.get(email)?.name || "Unknown",
        lastActive: userMetadata.get(email)?.lastActive || Date.now(),
      },
      messageHistory: messageHistory.get(email) || [],
    }));

    adminConnections.forEach((client) => {
      if (client.tenantId === tenantId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(
          JSON.stringify({
            type: "ROOM_LIST",
            payload: roomList,
          })
        );
      }
    });
  }

  ws.on("close", () => {
    if (currentRole === "ADMIN") {
      for (let client of adminConnections) {
        if (client.ws === ws) {
          adminConnections.delete(client);
          break;
        }
      }
    }

    if (currentUserEmail) {
      const connections = rooms.get(currentUserEmail);
      if (connections) {
        for (let conn of connections) {
          if (conn.ws === ws) {
            connections.delete(conn);
            break;
          }
        }

        if (connections.size === 0) {
          rooms.delete(currentUserEmail);
        }
      }
    }
  });
});
