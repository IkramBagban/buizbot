
import { WebSocket } from "ws";
import { ChatMessage, ChatRoom, UserRole } from "@repo/common";
import { ROLES } from "./constants";
const MESSAGE_HISTORY_LIMIT = 100;
class StateManager {
  private rooms: Map<
    string,
    Set<{ ws: WebSocket; tenantId: string; USER: string }>
  >;
  private adminConnections: Set<{ ws: WebSocket; tenantId: string }>;
  private userMetadata: Map<
    string,
    { name: string; lastActive: number; tenantId: string }
  >;
  private messageHistory: Map<string, ChatMessage[]>;

  constructor() {
    this.rooms = new Map();
    this.adminConnections = new Set();
    this.userMetadata = new Map();
    this.messageHistory = new Map();
  }

  addAdminConnection(ws: WebSocket, tenantId: string): void {
    this.adminConnections.add({ ws, tenantId });
  }

  removeAdminConnection(ws: WebSocket): void {
    for (const client of this.adminConnections) {
      if (client.ws === ws) {
        this.adminConnections.delete(client);
        break;
      }
    }
  }

  addUserConnection(
    email: string,
    ws: WebSocket,
    tenantId: string,
    user: string
  ): void {
    if (!this.rooms.has(email)) {
      this.rooms.set(email, new Set());
      this.messageHistory.set(email, []);
    }
    this.rooms.get(email)!.add({ ws, tenantId, USER: user });
    this.userMetadata.set(email, {
      name: user,
      lastActive: Date.now(),
      tenantId,
    });
  }

  removeUserConnection(email: string, ws: WebSocket): void {
    const connections = this.rooms.get(email);
    if (connections) {
      for (const conn of connections) {
        if (conn.ws === ws) {
          connections.delete(conn);
          break;
        }
      }
      if (connections.size === 0) {
        this.rooms.delete(email);
        this.userMetadata.delete(email);
      }
    }
  }

  updateMessageHistory(roomId: string, message: ChatMessage): void {
    const history = this.messageHistory.get(roomId) || [];
    history.push(message);
    this.messageHistory.set(roomId, history.slice(-MESSAGE_HISTORY_LIMIT));
  }

  getRoomsByTenantId(
    tenantId: string
  ): [string, Set<{ ws: WebSocket; tenantId: string; USER: string }>][] {
    console.log("TenantId", tenantId);

    return Array.from(this.rooms.entries()).filter(([_, connections]) => {
      return Array.from(connections).some((c) => c.tenantId === tenantId);
    });
  }

  getUserMetadata(email: string) {
    return (
      this.userMetadata.get(email) || {
        name: "Unknown",
        lastActive: Date.now(),
        tenantId: "",
      }
    );
  }

  getAdminConnectionsByTenantId(
    tenantId: string
  ): { ws: WebSocket; tenantId: string }[] {
    return Array.from(this.adminConnections).filter(
      (client) => client.tenantId === tenantId
    );
  }

  getMessageHistory(roomId: string): ChatMessage[] {
    return this.messageHistory.get(roomId) || [];
  }
}

export default new StateManager();
