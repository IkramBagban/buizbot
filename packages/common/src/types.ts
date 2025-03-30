export type UserRole = "USER" | "ADMIN" | "AGENT";
export type MessageType = "JOIN" | "CHAT"
export type MessageDirection = "in" | "out";

export interface ChatMessage {
  content: string;
  timestamp: number;
  direction: MessageDirection;
  senderId: string; 
  recipientId: string;
}

export interface ChatRoom {
  roomId: string; // user email
  userMetadata: {
    name: string;
    email: string;
    lastActive: number;
  };
  messageHistory: ChatMessage[];
}

export type WSMessage = 
  | { type: "JOIN", role: UserRole, payload?: { email?: string, name?: string } }
  | { type: "CHAT", payload: ChatMessage & { roomId: string } }
  | { type: "ROOM_LIST", payload: ChatRoom[] }
  | { type: "HISTORY", payload: ChatMessage[] };