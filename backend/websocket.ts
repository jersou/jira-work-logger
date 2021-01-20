import { WebSocket, WebSocketServer } from "https://deno.land/x/websocket@v0.0.6/mod.ts";
import { deferred } from "https://deno.land/std@0.83.0/async/mod.ts";

// on client: new WebSocket("ws://127.0.0.1:8001")
export function runWebsocketServerAndWaitClose() {
  const exitDeferred = deferred<number>();
  const wss = new WebSocketServer(8001);

  wss.on("connection", (ws: WebSocket) => {
    console.log("[WebSocketServer] connection");
    ws.on("close", () => {
      exitDeferred.resolve();
      wss.close();
      console.log("[WebSocketServer] close");
    });
  });
  return exitDeferred;
}

if (import.meta.main) {
  runWebsocketServerAndWaitClose().then(() => {
    console.log("exit");
    Deno.exit(0);
  });
}
