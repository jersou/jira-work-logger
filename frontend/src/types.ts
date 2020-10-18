export type Worklogs = {
  author: { key: string };
  started: string;
  timeSpentSeconds: number;
};
export type IssueType = {
  id?: string;
  key: string;
  reactKey?: number;
  fields?: {
    summary?: string;
    worklog?: {
      worklogs: Worklogs[];
    };
  };
  workLogComment?: string;
};
export type WorkLogTableData = {
  dates: Date[];
  issues: IssueType[];
  hours: number[][];
};
export type ConfigData = {
  jiraUrl: string;
  username: string;
  password: string;
  hamsterIgnoredCategories: string;
  hamsterDaysToImport: number;
};
export type WorksLogged = { [key: string]: number };
export type AppState = {
  data: WorkLogTableData;
  config: ConfigData;
  worksLogged: WorksLogged;
};
export type HamsterReportElement = {
  comment: string;
  date: string;
  hours: number;
};

export type ToLogElement = {
  key: string;
  comment: string;
  date: string;
  hours: number;
};
