import { ConfigData, ToLogElement } from "../frontend/src/types.ts";

export type jiraApiOptions = {
  method?: string;
  body?: string;
};

export async function jiraApi(config: ConfigData, query: string, options?: jiraApiOptions): Promise<string> {
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

export async function jiraJql(config: ConfigData, jql: string): Promise<string> {
  return await jiraApi(config, `search?fields=summary,worklog&maxResults=20&jql=${jql.replace(/\s+/g, " ")}`);
}

export async function myLastIssues(config: ConfigData): Promise<string> {
  const jql = `
      (
        assignee = currentUser()
        AND ( resolution = Unresolved OR updatedDate >= "-14d" )
        AND updatedDate >= startOfYear()
      ) OR (
        worklogAuthor = currentUser() AND worklogDate > "-14d"
      )
      order by updatedDate DESC`;
  return jiraJql(config, jql);
}

export function logElement(config: ConfigData, log: ToLogElement): Promise<string> {
  return jiraApi(config, `issue/${log.key}/worklog`, {
    method: "POST",
    body: JSON.stringify({
      comment: log.comment,
      started: `${log.date}T20:00:00.000+0000`,
      timeSpent: `${log.hours}h`,
    }),
  });
}

export function issueSummary(config: ConfigData, issueKey: string) {
  return jiraApi(config, `issue/${issueKey}?fields=summary`);
}
