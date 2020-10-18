import { Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { lookup } from "https://deno.land/x/media_types@v2.5.1/mod.ts";
import { files } from "./filesContent.ts";
import { getHamsterReport } from "./hamster.ts";
import { ConfigData, ToLogElement } from "./frontend/src/types.ts";
import { decodeFileContent } from "./filesContentGenerator.ts";

export type jiraApiOptions = {
  method?: string;
  body?: string;
};

export async function jiraApi(config: ConfigData, query: string, options?: jiraApiOptions) {
  if (!config.jiraUrl.match(/^http/)) {
    throw new Error("bad jira url configuration");
  }
  const headers = new Headers();
  headers.append("Authorization", "Basic " + btoa(`${config.username}:${config.password}`));
  if (options?.body) {
    headers.append("Content-Type", "application/json");
  }
  const url = `${config.jiraUrl}/rest/api/2/${query}`;
  const response = await fetch(url, { ...options, headers });
  console.log(`%c[jiraApi] ${response.status} ${options?.method || "GET"} ${url}`, "color:green");
  return await response.json();
}

export async function jiraJql(config: ConfigData, jql: string) {
  return await jiraApi(config, `search?fields=summary,worklog&maxResults=20&jql=${jql.replaceAll(/\s+/g, " ")}`);
}

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

export function addStaticFilesRoutes(router: Router) {
  if (files["index.html"]) {
    router.get("/", (ctx) => {
      ctx.response.body = decodeFileContent(files["index.html"]);
      ctx.response.type = lookup("index.html");
    });
  }
  Object.entries(files).map(([path, content]) =>
    router.get(`/${path}`, (ctx) => {
      ctx.response.body = decodeFileContent(content);
      ctx.response.type = lookup(path);
    })
  );
}

export function addJiraRoutes(router: Router) {
  router.post("/myLastIssues", async (ctx) => {
    const config: ConfigData = JSON.parse(await ctx.request.body().value);
    const jql = `
      (
        assignee = currentUser()
        AND ( resolution = Unresolved OR updatedDate >= startOfWeek() )
        AND updatedDate >= startOfYear()
      ) OR (
        worklogAuthor = currentUser() AND worklogDate > startOfWeek()
      )
      order by updatedDate DESC`;
    ctx.response.body = await jiraJql(config, jql);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });

  router.post("/issue/:issueKey", async (ctx) => {
    const config: ConfigData = JSON.parse(await ctx.request.body().value);
    ctx.response.body = await jiraApi(config, `issue/${ctx.params.issueKey}?fields=summary`);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });

  router.post("/createWorkLogs", async (ctx) => {
    const { config, toLog }: { config: ConfigData; toLog: ToLogElement[] } = JSON.parse(await ctx.request.body().value);
    await Promise.all(
      toLog.map((log) =>
        jiraApi(config, `issue/${log.key}/worklog`, {
          method: "POST",
          body: JSON.stringify({
            comment: log.comment,
            started: `${log.date}T20:00:00.000+0000`,
            timeSpent: `${log.hours}h`,
          }),
        })
      )
    );
    ctx.response.body = '{"status":"OK"}';
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });
}

export function addHamsterRoute(router: Router) {
  router.get("/hamsterExport", async (ctx) => {
    const ignoreCategories = ctx.request.url.searchParams.get("ignore");
    const hamsterDaysToImport = Number(ctx.request.url.searchParams.get("hamsterDaysToImport") || 5);
    const begin = new Date(Date.now() - 1000 * 60 * 60 * 24 * hamsterDaysToImport).toISOString().substr(0, 10);
    const end = new Date().toISOString().substr(0, 10);
    console.log(
      `%c[hamsterExport] hamsterDaysToImport=${hamsterDaysToImport} begin=${begin} end=${end}`,
      "color:indigo"
    );
    ctx.response.body = await getHamsterReport(begin, end, ignoreCategories);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });
}
