export function runWebsocketServerAndWaitClose() {
  const exitDeferred = Promise.withResolvers<void>();
  const server = Deno.serve({ port: 8001 }, (req) => {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("close", async () => {
      exitDeferred.resolve();
      console.log("[WebSocketServer] close");
      await server.shutdown();
      console.log("[WebSocketServer] shutdown");
    });
    return response;
  });
  return exitDeferred.promise;
}
