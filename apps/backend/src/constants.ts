export const PORT = 8080;
export const MESSAGE_HISTORY_LIMIT = 100;
export const MESSAGE_TYPES = {
  JOIN: "JOIN",
  CHAT: "CHAT",
  ROOM_LIST: "ROOM_LIST",
} as const;
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;