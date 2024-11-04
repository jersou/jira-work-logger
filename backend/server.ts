#!/usr/bin/env -S deno run --unstable --allow-net --allow-run
import { Application } from "@oak/oak";
// import { opn } from "./opn.ts";
import { getRouter } from "./router.ts";
import { runWebsocketServerAndWaitClose } from "./websocket.ts";
import $ from "@david/dax";
import { cliteRun } from "@jersou/clite";

export class JiraWorkLogger {
  port = 8000;
  _controller = new AbortController();
  _oakApp = new Application();
  dontWaitAndClose = false;
  browserCommand = `google-chrome --app=http://localhost:${this.port}`;

  main() {
    this._oakApp.addEventListener("error", (evt) => console.log(evt.error));
    this._oakApp.addEventListener("listen", async () => {
      console.log(`Listening on: http://localhost:${this.port}`);
      await $.raw`${this.browserCommand}`;
    });
    this._oakApp.use(getRouter(this._controller).routes());
    this._oakApp.listen({
      hostname: "127.0.0.1",
      port: this.port,
      signal: this._controller.signal,
    });

    if (!this.dontWaitAndClose) {
      runWebsocketServerAndWaitClose().then(() => this._controller.abort());
    }
  }
}
cliteRun(JiraWorkLogger, { meta: import.meta });
