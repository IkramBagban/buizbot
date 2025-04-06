import { WebSocket } from "ws";
import { ChatMessage, ChatRoom } from "@repo/common";
import stateManager from "./stateManager";

function broadcastRoomList(tenantId: string): void {
  const filteredRooms = stateManager.getRoomsByTenantId(tenantId);
  // @ts-ignore
  const roomList: ChatRoom[] = filteredRooms.map(([email]) => ({
    roomId: email,
    userMetadata: stateManager.getUserMetadata(email),
    messageHistory: stateManager.getMessageHistory(email),
  }));

  stateManager.getAdminConnectionsByTenantId(tenantId).forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ type: "ROOM_LIST", payload: roomList }));
    }
  });
}

export { broadcastRoomList };
