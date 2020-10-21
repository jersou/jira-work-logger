import {AppState, HamsterReportElement} from "../types";
import {actions, AppThunk, Dispatch, GetState} from "./slice";
import {Draft} from "@reduxjs/toolkit";
import {round2} from "../utils";
import {getIssueSummaryFromJira} from "./onIssueKeyUpdatedThunk";

export const importHamsterReportThunk = (): AppThunk => async (dispatch: Dispatch, getState: GetState) => {
  const resp = await fetch(
    `http://localhost:8000/hamsterExport?hamsterDaysToImport=${getState().config.hamsterDaysToImport}&ignore=${getState().config.hamsterIgnoreComment}`
  )
  const hamsterReport: HamsterReportElement[] = await resp.json()
  await dispatch(actions.importHamsterReport({hamsterReport}));
  getState().data.issues.forEach((issue, index) => {
    if (issue.key) {
      getIssueSummaryFromJira({key: issue.key}, getState, dispatch, index)
    }
  })
};

export function importHamsterReportToState(hamsterReport: HamsterReportElement[], state: Draft<AppState>) {
  const dates = new Set(hamsterReport.map(log => log.date))
  const comments = new Set(hamsterReport.map(log => log.comment))

  const keyFromComment = (comment: string) =>
    comment.match(/[A-Z]+-[0-9]+/) ?
      comment.replace(/^(.*?)([A-Z]+-[0-9]+)(.*?)$/g, "$2")
      : ""

  state.data = {
    dates: Array.from(dates).sort().map(str => new Date(str)),
    issues: Array.from(comments).map(comment => ({
      key: keyFromComment(comment),
      workLogComment: comment,
      reactKey: Math.random()
    })),
    hours: []
  }
  dates.forEach(() => state.data.hours.push(new Array(state.data.issues.length).fill(0)))

  hamsterReport.forEach(({comment, hours, date}) => {
    const commentIndex = state.data.issues.map(issue => issue.workLogComment).indexOf(comment)
    if (commentIndex >= 0) {
      const dateIndex = state.data.dates.map(date => date.toISOString().substr(0, 10)).indexOf(date)
      if (dateIndex >= 0) {
        state.data.hours[dateIndex][commentIndex] = round2(state.data.hours[dateIndex][commentIndex] + hours)
      }
    }
  })
}
