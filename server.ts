#!/usr/bin/env -S deno run --unstable --allow-net --allow-run
import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { Application } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { opn } from "./opn.ts";
import { addHamsterRoute, addJiraRoutes, addStaticFilesRoutes, addStopRoute } from "./router.ts";

const port = 8000;
const controller = new AbortController();
const oakApp = new Application();
oakApp.addEventListener("error", (evt) => console.log(evt.error));
oakApp.addEventListener("listen", async () => {
  console.log(`Listening on: http://localhost:${port}`);
  opn(`http://localhost:${port}`, { checkDenoPermission: true }).catch(() =>
    console.log(
      "Run permission is missing, the hamster import will not work, and the localhost url was not opened in the default web browser at launch"
    )
  );
});

const router = new Router();
addStopRoute(router, controller);
addStaticFilesRoutes(router);
addJiraRoutes(router);
addHamsterRoute(router);
oakApp.use(router.routes());

oakApp.listen({ hostname: "127.0.0.1", port, signal: controller.signal });
