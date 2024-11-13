#!/usr/bin/env -S deno run -A

import { cliteRun, help, hidden } from "@jersou/clite";
import { DesktopWebApp } from "@jersou/desktop-web-app";
import assetsFromJson from "./assets_bundle.json" with { type: "json" };
import { getHamsterReport } from "./backend/hamster.ts";
import type { ConfigData, ToLogElement } from "./frontend/src/types.ts";
import { toText } from "@std/streams";
import { issueSummary, logElement, myLastIssues } from "./backend/jira.ts";
import $ from "@david/dax";

class JiraWorkLogger extends DesktopWebApp {
  @help("Keep the server alive after the last client disconnects")
  notExitIfNoClient = false;

  @hidden()
  sockets = new Set<WebSocket>();

  @hidden()
  issuesCache: { [key: string]: string } = {};

  override routes = [
    {
      route: new URLPattern({ pathname: "/api/hamsterExport" }),
      exec: async (_match: URLPatternResult, request: Request) => {
        const params = new URL(request.url).searchParams;
        const ignore = params.get("ignore");
        const hamsterDaysToImport = Number(
          params.get("hamsterDaysToImport") || 5,
        );
        const begin = new Date(
          Date.now() - 1000 * 60 * 60 * 24 * hamsterDaysToImport,
        ).toISOString().substring(0, 10);
        const end = new Date().toISOString().substring(0, 10);
        console.log(
          `%c[hamsterExport] hamsterDaysToImport=${hamsterDaysToImport} begin=${begin} end=${end}`,
          "color:indigo",
        );
        const body = await getHamsterReport(begin, end, ignore);
        return new Response(JSON.stringify(body));
      },
    },

    {
      route: new URLPattern({ pathname: "/api/stop" }),
      exec: () => {
        console.log("Stop");
        setTimeout(() => Deno.exit(0), 100);
        return new Response("stop ok");
      },
    },

    {
      route: new URLPattern({ pathname: "/api/myLastIssues" }),
      exec: async (_match: URLPatternResult, request: Request) => {
        const config: ConfigData = JSON.parse(await toText(request.body!));
        const body = await myLastIssues(config);
        return new Response(JSON.stringify(body));
      },
    },

    {
      route: new URLPattern({ pathname: "/issue/:issueKey" }),
      exec: async (match: URLPatternResult, request: Request) => {
        const issueKey = match.pathname.groups.issueKey;
        if (issueKey) {
          let issue;
          if (this.issuesCache[issueKey]) {
            console.log(`%c[jiraIssuesCache] ${issueKey}`, "color:green");
            issue = this.issuesCache[issueKey];
          } else {
            const config: ConfigData = JSON.parse(await toText(request.body!));
            issue = await issueSummary(config, issueKey);
            this.issuesCache[issueKey] = issue;
          }
          return new Response(JSON.stringify(issue));
        }
        return new Response(null, { status: 404 });
      },
    },

    {
      route: new URLPattern({ pathname: "/createWorkLogs" }),
      exec: async (_match: URLPatternResult, request: Request) => {
        const { config, toLog }: { config: ConfigData; toLog: ToLogElement[] } =
          JSON.parse(await toText(request.body!));

        // sequence POSTs → otherwise Jira bugs on remaining and total logged (not updated)
        for (const log of toLog) {
          await logElement(config, log);
          await $.sleep(800);
        }
        return new Response(JSON.stringify({ "status": "OK" }));
      },
    },

    { // WebSocket
      route: new URLPattern({ pathname: "/api/events-ws" }),
      exec: (_match: URLPatternResult, request: Request) => {
        if (request.headers.get("upgrade") != "websocket") {
          return new Response(null, { status: 501 });
        }
        const { socket, response } = Deno.upgradeWebSocket(request);
        socket.addEventListener("open", () => {
          this.sockets.add(socket);
          console.log(`a client connected! ${this.sockets.size} clients`);
        });
        socket.addEventListener("close", () => {
          this.sockets.delete(socket);
          console.log(`a client disconnected! ${this.sockets.size} clients`);
          if (!this.notExitIfNoClient && this.sockets.size === 0) {
            console.log(`→ ExitIfNoClient → shutdown the server !`);
            Deno.exit(0);
          }
        });
        return response;
      },
    },
  ];

  constructor() {
    super({
      assetsFromJson,
      frontendPath: "frontend/dist",
      openInBrowser: "google-chrome",
      openInBrowserAppMode: true,
      port: 8000,
    });
  }

  override onListen = async () => {
  };
}

if (import.meta.main) {
  cliteRun(JiraWorkLogger, { meta: import.meta });
}
