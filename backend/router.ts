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
    const jql = `
      (
        assignee = currentUser()
        AND ( resolution = Unresolved OR updatedDate >= "-14d" )
        AND updatedDate >= startOfYear()
      ) OR (
        worklogAuthor = currentUser() AND worklogDate > "-14d"
      )
      order by updatedDate DESC`;
    ctx.response.body = await jiraJql(config, jql);
    ctx.response.type = "application/json";
    allowLocalhost(ctx);
  });

  let issuesCache: { [key: string]: string } = {};
  router.post("/issue/:issueKey", async (ctx) => {
    if (ctx.params.issueKey) {
      let issue;
      if (issuesCache[ctx.params.issueKey]) {
        console.log(`%c[jiraIssuesCache] ${ctx.params.issueKey}`, "color:green");
        issue = issuesCache[ctx.params.issueKey];
      } else {
        const config: ConfigData = JSON.parse(await ctx.request.body().value);
        issue = await jiraApi(config, `issue/${ctx.params.issueKey}?fields=summary`);
        issuesCache[ctx.params.issueKey] = issue;
      }
      ctx.response.body = issue;
      ctx.response.type = "application/json";
      allowLocalhost(ctx);
    }
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
