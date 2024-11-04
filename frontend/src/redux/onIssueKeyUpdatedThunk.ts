import { IssueType } from "../types";
import { actions, AppThunk, Dispatch, GetState } from "./slice";

const issuesCache: { [key: string]: IssueType } = {};

export async function getIssueSummaryFromJira(
  newData: { key?: string; comment?: string },
  getState: GetState,
  dispatch: Dispatch,
  y: number
) {
  const key = newData.key?.trim() || "";
  const issueFromJira = issuesCache[key]
    ? issuesCache[key]
    : await fetch(`http://localhost:8000/issue/${key}`, {
        method: "POST",
        body: JSON.stringify(getState().config),
      })
        .then(async (resp) => (await resp.json()) || { key: "" })
        .catch(() => ({ key: "" }));
  issuesCache[key] = issueFromJira;
  if (issueFromJira?.key === newData.key) {
    dispatch(
      actions.setIssueValue({
        y,
        issue: {
          key: newData.key || "",
          fields: { summary: issueFromJira?.fields?.summary },
        },
      })
    );
  }
}

export const onIssueKeyUpdatedThunk =
  (
    timeout: NodeJS.Timeout | undefined,
    setTimeoutRef: (timeout: NodeJS.Timeout) => void,
    issue: IssueType,
    y: number,
    newData: { key?: string; comment?: string }
  ): AppThunk =>
  async (dispatch: Dispatch, getState: GetState) => {
    timeout && clearTimeout(timeout);
    if (newData.key !== undefined) {
      if (newData.key?.trim().match(/[A-Za-z0-9]+-[0-9]+/)) {
        dispatch(
          actions.setIssueValue({
            y,
            issue: { ...issue, key: newData.key || "", fields: { summary: "" } },
          })
        );
        setTimeoutRef(setTimeout(() => getIssueSummaryFromJira(newData, getState, dispatch, y), 1000));
      } else {
        dispatch(
          actions.setIssueValue({
            y,
            issue: { ...issue, key: newData.key || "", fields: { summary: "" } },
          })
        );
      }
    }
    if (newData.comment !== undefined) {
      dispatch(
        actions.setIssueValue({
          y,
          issue: { ...issue, workLogComment: newData.comment },
        })
      );
    }
  };
