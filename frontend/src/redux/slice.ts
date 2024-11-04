import { configureStore, createSlice, Draft, PayloadAction, ThunkDispatch, Tuple } from "@reduxjs/toolkit";
import { thunk, ThunkAction } from "redux-thunk";
import { produce } from "immer";
import { localStorageKey, stateToLocalStorageMiddleware } from "./StateToLocalStorageMiddleware";
import { importHamsterReportToState } from "./importHamsterReportThunk";
import {
  AppState,
  ConfigData,
  HamsterReportElement,
  IssueType,
  WebsocketState,
  WorkLogTableData,
  WorksLogged,
} from "../types";

function addColumn(data: WorkLogTableData, date?: Date): WorkLogTableData {
  return produce(data, (newData) => {
    const lastDate = data.dates.length > 0 ? data.dates[data.dates.length - 1] : null;
    newData.dates.push(date ? date : lastDate ? new Date(lastDate.getTime() + 24 * 60 * 60 * 1000) : new Date());
    newData.hours.push(newData.issues.map(() => 0));
  });
}

function initWithLast5days(data: WorkLogTableData): WorkLogTableData {
  return produce(data, (newData) => {
    newData = addColumn(newData, new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000));
    for (let i = 0; i < 4; i++) {
      newData = addColumn(newData);
    }
    return newData;
  });
}

function addRow(data: WorkLogTableData, issue: IssueType = { key: "" }): WorkLogTableData {
  return produce(data, (newData) => {
    newData.issues.push({
      ...issue,
      reactKey: issue.reactKey || Math.random(),
    });
    newData.hours.map((col) => col.push(0));
  });
}

const getInitialState: () => AppState = () => {
  let obj;
  const localStorageState = localStorage.getItem(localStorageKey);
  if (localStorageState) {
    obj = JSON.parse(localStorageState);
    obj.data.dates = obj.data.dates.map((dateStr: string) => new Date(dateStr));
  } else {
    obj = {
      data: addRow(initWithLast5days({ dates: [], hours: [], issues: [] })),
      config: {
        jiraUrl: "jiraUrl",
        username: "username",
        password: "password",
        token: "token",
        hamsterDaysToImport: 5,
        hamsterIgnoreComment: "",
      },
      websocketState: "UNDEFINED",
    };
  }
  obj.logThisWorkInProgress = false;
  return obj;
};

const slice = createSlice({
  name: "root",
  initialState: getInitialState(),
  reducers: {
    clearData(state: Draft<AppState>) {
      state.data = { dates: [], issues: [], hours: [] };
    },
    addLast5Days(state: Draft<AppState>) {
      state.data = initWithLast5days(state.data);
    },
    setConfig(state: Draft<AppState>, { payload: { config } }: PayloadAction<{ config: ConfigData }>) {
      state.config = config;
    },
    issueClicked(state: Draft<AppState>, { payload: { issue } }: PayloadAction<{ issue: IssueType }>) {
      state.data = addRow(state.data, {
        key: issue.key,
        fields: { summary: issue.fields?.summary },
      });
    },
    addRow(state: Draft<AppState>) {
      state.data = addRow(state.data);
    },
    addColumn(state: Draft<AppState>) {
      state.data = addColumn(state.data);
    },
    setData(state: Draft<AppState>, { payload: { data } }: PayloadAction<{ data: WorkLogTableData }>) {
      state.data = data;
    },
    setIssueValue(state: Draft<AppState>, { payload: { y, issue } }: PayloadAction<{ y: number; issue: IssueType }>) {
      state.data.issues[y] = {
        ...issue,
        workLogComment: issue.workLogComment !== undefined ? issue.workLogComment : state.data.issues[y].workLogComment,
        reactKey: state.data.issues[y].reactKey || Math.random(),
      };
    },
    removeColumn(state: Draft<AppState>, { payload: { num } }: PayloadAction<{ num: number }>) {
      state.data.dates.splice(num, 1);
      state.data.hours.splice(num, 1);
    },
    removeRow(state: Draft<AppState>, { payload: { num } }: PayloadAction<{ num: number }>) {
      state.data.issues.splice(num, 1);
      state.data.hours.map((col) => col.splice(num, 1));
    },
    setDateValue(state: Draft<AppState>, { payload: { num, date } }: PayloadAction<{ num: number; date: Date }>) {
      state.data.dates[num] = date;
    },
    setHourValue(
      state: Draft<AppState>,
      { payload: { x, y, hour } }: PayloadAction<{ x: number; y: number; hour: number }>
    ) {
      state.data.hours[x][y] = hour;
    },
    setWorksLogged(state: Draft<AppState>, { payload: { worksLogged } }: PayloadAction<{ worksLogged: WorksLogged }>) {
      state.worksLogged = worksLogged;
    },
    importHamsterReport(
      state: Draft<AppState>,
      { payload: { hamsterReport } }: PayloadAction<{ hamsterReport: HamsterReportElement[] }>
    ) {
      importHamsterReportToState(hamsterReport, state);
    },
    resetHours(state: Draft<AppState>) {
      state.data.hours.forEach((col, x) => col.forEach((cell, y) => (col[y] = 0)));
    },
    resetConfig() {
      localStorage.clear();
      return getInitialState();
    },
    websocketStatusChange(
      state: Draft<AppState>,
      { payload: { websocketState } }: PayloadAction<{ websocketState: WebsocketState }>
    ) {
      if (websocketState === "OPEN" || state.websocketState !== "ERROR") {
        state.websocketState = websocketState;
      }
    },
    setLogThisWorkInProgress(
      state: Draft<AppState>,
      { payload: { newLogThisWorkInProgress } }: PayloadAction<{ newLogThisWorkInProgress: boolean }>
    ) {
      state.logThisWorkInProgress = newLogThisWorkInProgress;
    },
  },
});

export type AppThunk = ThunkAction<void, AppState, unknown, PayloadAction<any>>;
export type Dispatch = ThunkDispatch<AppState, unknown, PayloadAction<any>>;
export type GetState = () => AppState;

export const actions = slice.actions;
export const store = configureStore({
  reducer: slice.reducer,
  middleware: () => new Tuple(thunk, stateToLocalStorageMiddleware),
});
