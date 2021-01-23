#!/usr/bin/env -S deno run --unstable --allow-net --allow-run
import { Application } from "../deps.ts";
import { opn } from "./opn.ts";
import { getRouter } from "./router.ts";
import { runWebsocketServerAndWaitClose } from "./websocket.ts";

const httpPort = 8000;
const controller = new AbortController();

const oakApp = new Application();
oakApp.addEventListener("error", (evt) => console.log(evt.error));
oakApp.addEventListener("listen", async () => {
  console.log(`Listening on: http://localhost:${httpPort}`);
  opn(`http://localhost:${httpPort}`, { checkDenoPermission: true }).catch(() =>
    console.log(
      "Run permission is missing, the hamster import will not work, and the localhost url was not opened in the default web browser at launch"
    )
  );
});

oakApp.use(getRouter(controller).routes());
oakApp.listen({ hostname: "127.0.0.1", port: httpPort, signal: controller.signal });

if (Deno.args.includes("--wait-and-close")) {
  runWebsocketServerAndWaitClose().then(() => controller.abort());
}
