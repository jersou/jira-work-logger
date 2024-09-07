import { actions, AppThunk, Dispatch, GetState } from "./slice";
import { ToLogElement } from "../types";
import { genWl, getLastIssues } from "../Jira";

export const createWorkLogsThunk =
  (): AppThunk => async (dispatch: Dispatch, getState: GetState) => {
    dispatch(
      actions.setLogThisWorkInProgress({ newLogThisWorkInProgress: true }),
    );
    try {
      const toLog: ToLogElement[] = getState().data.issues
        .map((issue, y) => ({ issue, y }))
        .filter(({ issue }) => issue.key.match(/^[A-Za-z0-9]+-[0-9]+$/))
        .flatMap(({ issue, y }) =>
          getState().data.dates.map((date, x) => ({
            issue,
            date,
            hours: getState().data.hours[x][y],
          }))
        )
        .filter(({ hours }) => hours > 0)
        .map(({ issue, date, hours }) => ({
          key: issue.key,
          comment: issue.workLogComment || "",
          date: date.toISOString().substr(0, 10),
          hours: hours,
        }));
      await fetch("http://localhost:8000/createWorkLogs", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ config: getState().config, toLog }),
      });
      dispatch(
        actions.setWorksLogged({
          worksLogged: genWl(
            await getLastIssues(getState().config),
            getState().config.username,
          ),
        }),
      );
      dispatch(actions.resetHours());
    } finally {
      dispatch(
        actions.setLogThisWorkInProgress({ newLogThisWorkInProgress: false }),
      );
    }
  };
