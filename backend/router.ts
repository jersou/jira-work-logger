import { lookup, Router, RouterContext } from "../deps.ts";
import { files } from "../bundler/filesContent.ts";
import { decodeFileContent } from "../bundler/filesContentGenerator.ts";
import { ConfigData, ToLogElement } from "../frontend/src/types.ts";
import { getHamsterReport } from "./hamster.ts";
import { myLastIssues, logElement, issueSummary } from "./jira.ts";

function allowLocalhost(ctx: RouterContext<Record<string | number, string | undefined>, Record<string, any>>) {
  const origin = ctx.request.headers.get("Origin");
  if (origin?.match(/http:\/\/localhost:.*/)) {
    ctx.response.headers.set("Access-Control-Allow-Origin", origin);
  }
}

export function addStopRoute(router: Router, controller: AbortController) {
  router.post("/stop", (ctx) => {
    ctx.response.body = "stop ok";
    console.log("Stop");
    controller.abort();
  });
}

export async function addStaticFilesRoutes(router: Router) {
  if (files["index.html"]) {
    const indexContent = await decodeFileContent(files["index.html"]);
    router.get("/", (ctx) => {
      ctx.response.body = indexContent;
      ctx.response.type = lookup("index.html");
    });
  }
  Object.entries(files)
    .map(([path, content]) => [path, lookup(path), decodeFileContent(content)])
    .map(([path, type, bodyPromise]) =>
      router.get(`/${path}`, async (ctx) => {
        ctx.response.body = await bodyPromise;
        ctx.response.type = String(type);
      })
    );
}

export function addJiraRoutes(router: Router) {
  router.post("/myLastIssues", async (ctx) => {
    const config: ConfigData = JSON.parse(await ctx.request.body().value);
    ctx.response.body = await myLastIssues(config);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });

  const issuesCache: { [key: string]: string } = {};
  router.post("/issue/:issueKey", async (ctx) => {
    if (ctx.params.issueKey) {
      let issue;
      if (issuesCache[ctx.params.issueKey]) {
        console.log(`%c[jiraIssuesCache] ${ctx.params.issueKey}`, "color:green");
        issue = issuesCache[ctx.params.issueKey];
      } else {
        const config: ConfigData = JSON.parse(await ctx.request.body().value);
        issue = await issueSummary(config, ctx.params.issueKey);
        issuesCache[ctx.params.issueKey] = issue;
      }
      ctx.response.body = issue;
      ctx.response.type = "application/json";
      allowLocalhost(ctx);
    }
  });

  router.post("/createWorkLogs", async (ctx) => {
    const { config, toLog }: { config: ConfigData; toLog: ToLogElement[] } = JSON.parse(await ctx.request.body().value);

    // sequence POSTs → otherwise Jira bugs on remaining and total logged (not updated)
    for (const log of toLog) {
      await logElement(config, log);
      // sleep 200 ms
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    ctx.response.body = '{"status":"OK"}';
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });
}

export function addHamsterRoute(router: Router) {
  router.get("/hamsterExport", async (ctx) => {
    const ignore = ctx.request.url.searchParams.get("ignore");
    const hamsterDaysToImport = Number(ctx.request.url.searchParams.get("hamsterDaysToImport") || 5);
    const begin = new Date(Date.now() - 1000 * 60 * 60 * 24 * hamsterDaysToImport).toISOString().substr(0, 10);
    const end = new Date().toISOString().substr(0, 10);
    console.log(
      `%c[hamsterExport] hamsterDaysToImport=${hamsterDaysToImport} begin=${begin} end=${end}`,
      "color:indigo"
    );
    ctx.response.body = await getHamsterReport(begin, end, ignore);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });
}

export function getRouter(controller: AbortController): Router {
  const router = new Router();
  addStopRoute(router, controller);
  addStaticFilesRoutes(router);
  addJiraRoutes(router);
  addHamsterRoute(router);
  return router;
}
