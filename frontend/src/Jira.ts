import { ConfigData, IssueType, WorksLogged } from "./types";

export async function getLastIssues(config: ConfigData) {
  return await fetch("http://localhost:8000/myLastIssues", {
    method: "POST",
    body: JSON.stringify(config),
  })
    .then(async (resp) => (await resp.json()).issues || [])
    .catch(() => []);
}

export function genWl(issues: IssueType[], username: string) {
  const wlTot: WorksLogged = {};
  issues
    .flatMap((issue: IssueType) => issue.fields?.worklog?.worklogs || [])
    .filter((wl) => wl.author.key === username)
    .map(({ started, timeSpentSeconds }) => ({
      date: started.substr(0, 10),
      timeSpentSeconds,
    }))
    .forEach(({ date, timeSpentSeconds }) => (wlTot[date] = timeSpentSeconds + (wlTot[date] || 0)));
  return wlTot;
}
