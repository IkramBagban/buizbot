// @ts-nocheck

import { WebSocket } from "ws";
import { ChatMessage, ChatRoom, UserRole, WSMessage } from "@repo/common";
import stateManager from "./stateManager";
import { broadcastRoomList } from "./broadcastUtils";
import { MESSAGE_TYPES, ROLES } from "./constants";

class ChatManager {
  private ws: WebSocket;
  private currentRole: UserRole | null = null;
  private currentUserEmail: string | null = null;
  private currentTenantId: string | null = null;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.initialize();
  }

  private initialize(): void {
    console.log("user connected");

    this.ws.on("message", (rawData) => {
      try {
        const message = JSON.parse(rawData.toString()) as WSMessage;
        console.log("message", message);
        this.handleMessage(message);
      } catch (error) {
        console.error("Message handling error:", error);
      }
    });

    this.ws.on("close", () => this.handleDisconnect());
  }

  private handleMessage(message: WSMessage): void {
    switch (message.type) {
      case MESSAGE_TYPES.JOIN:
        this.handleJoin(message);
        break;
      case MESSAGE_TYPES.CHAT:
        this.handleChat(message.payload);
        break;
      case MESSAGE_TYPES.ROOM_LIST:
        this.handleRoomList(message.payload.tenantId);
        break;
    }
  }

  private handleJoin(message: WSMessage): void {
    this.currentRole = message.role;
    this.currentTenantId = message.payload.tenantId;

    if (message.role === ROLES.ADMIN) {
      stateManager.addAdminConnection(this.ws, this.currentTenantId);
      broadcastRoomList(this.currentTenantId);
      return;
    }

    if (!message.payload?.email || !message.payload.name) {
      this.ws.close(4001, "Missing user credentials");
      return;
    }

    this.currentUserEmail = message.payload.email;
    stateManager.addUserConnection(
      this.currentUserEmail,
      this.ws,
      this.currentTenantId,
      message.payload.name
    );
    broadcastRoomList(this.currentTenantId);
  }

  private handleChat(payload: ChatMessage & { roomId: string }): void {
    stateManager.updateMessageHistory(payload.roomId, payload);

    console.log("payload", payload);
    const receivers =
      this.currentRole === ROLES.ADMIN
        ? stateManager.getRoomsByTenantId(payload.tenantId)[0]?.[1] || new Set()
        : stateManager.getAdminConnectionsByTenantId(payload.tenantId);

    console.log("receivers", receivers);

    receivers.forEach((client) => {
      const targetWS = this.currentRole === ROLES.ADMIN ? client.ws : client.ws;
      if (targetWS.readyState === WebSocket.OPEN) {
        targetWS.send(JSON.stringify({ type: MESSAGE_TYPES.CHAT, payload }));
      }
    });
  }

  private handleRoomList(tenantId: string): void {
    broadcastRoomList(tenantId);
  }

  private handleDisconnect(): void {
    if (this.currentRole === ROLES.ADMIN) {
      stateManager.removeAdminConnection(this.ws);
      broadcastRoomList(this.currentTenantId || "");
    } else if (this.currentUserEmail) {
      stateManager.removeUserConnection(this.currentUserEmail, this.ws);
      broadcastRoomList(this.currentTenantId || "");
    }
  }
}

export default ChatManager;
