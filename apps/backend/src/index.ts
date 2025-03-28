import { WebSocket, WebSocketServer } from "ws";

const PORT = 8080
const wss = new WebSocketServer({ port: PORT });
console.log(`port is listening at ${PORT}`)


const rooms: Record<string, Set<WebSocket>> = {};

enum MESSAGE_ACTIONS {
  JOIN = "JOIN",
  CHAT = "CHAT",
}

wss.on("connection", (ws) => {
  console.log("user connected..");
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data.toString() || "{}");
    console.log("parsedData", parsedData);

    if (parsedData.type === MESSAGE_ACTIONS.JOIN) {
      if (!rooms[parsedData.payload.room_id]) {
        rooms[parsedData.payload.room_id] = new Set();
        console.log("user connected with room " + parsedData.payload.room_id);
      }
      rooms[parsedData.payload.room_id].add(ws);
    }

    if (parsedData.type === MESSAGE_ACTIONS.CHAT) {
      const usersConnectedToCurrentRoom = rooms[parsedData.payload.room_id];
      for (const userSocket of usersConnectedToCurrentRoom) {
        userSocket.send(
          JSON.stringify({ message: parsedData.payload.message })
        );
      }
    }
  });
});
