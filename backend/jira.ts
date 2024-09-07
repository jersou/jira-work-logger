import { ConfigData, ToLogElement } from "../frontend/src/types.ts";

// FIXME
const useCookies = true;

export type jiraApiOptions = {
  method?: string;
  body?: string;
};

export async function jiraApi(
  config: ConfigData,
  query: string,
  options?: jiraApiOptions,
): Promise<string> {
  if (!config.jiraUrl.match(/^http/)) {
    throw new Error("bad jira url configuration");
  }
  const headers = new Headers();
  if (config.token) {
    headers.append("Authorization", "Bearer " + config.token);
  } else {
    if (useCookies) {
      const resp = await fetch(
        `${config.jiraUrl.replace(/\/$/, "")}/login.jsp`,
        {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: `os_username=${
            encodeURI(config.username).replaceAll("&", "%26")
          }&os_password=${
            encodeURI(
              config.password,
            ).replaceAll("&", "%26")
          }&os_destination=&user_role=&atl_token=&login=Log+In`,
          redirect: "manual",
        },
      );
      if (resp.headers.get("x-seraph-loginreason") !== "OK") {
        throw new Error("auth KO");
      }
      headers.append("cookie", resp.headers.get("set-cookie") || "");
    } else {
      headers.append(
        "Authorization",
        "Basic " + btoa(`${config.username}:${config.password}`),
      );
    }
  }
  if (options?.body) {
    headers.append("Content-Type", "application/json");
  }
  const url = `${config.jiraUrl.replace(/\/$/, "")}/rest/api/2/${query}`;
  const response = await fetch(url, { ...options, headers });
  console.log(
    `%c[jiraApi] ${response.status} ${options?.method || "GET"} ${url}`,
    "color:green",
  );
  return await response.json();
}

export async function jiraJql(
  config: ConfigData,
  jql: string,
): Promise<string> {
  return await jiraApi(
    config,
    `search?fields=summary,worklog&maxResults=20&jql=${
      jql.replace(/\s+/g, " ")
    }`,
  );
}

export function myLastIssues(config: ConfigData): Promise<string> {
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

export function logElement(
  config: ConfigData,
  log: ToLogElement,
): Promise<string> {
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
