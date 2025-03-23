import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 7070 });

const connectedUsers: WebSocket[] = [];

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  console.log("connected..");
  connectedUsers.push(ws);

  ws.on("message", function message(data) {
    for (let i = 0; i < connectedUsers.length; i++) {
      const message = data.toString();
      const s = connectedUsers[i];

      s.send(message);
    }
  });
});
