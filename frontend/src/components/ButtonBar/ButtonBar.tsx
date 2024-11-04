import { genWl, getLastIssues } from "../../Jira";
import { Button, IconButton } from "@mui/material";
import { Add, Delete, GetApp, Link, Send } from "@mui/icons-material";
import { StopServer } from "../StopServer/StopServer";
import React from "react";
import { ConfigData, WebsocketState, WorksLogged } from "../../types";

export type ButtonBarProps = {
  config: ConfigData;
  clearData: () => void;
  hamsterImport: () => void;
  addLast5Days: () => void;
  createWorkLogs: () => void;
  setWorksLogged: ({ worksLogged }: { worksLogged: WorksLogged }) => void;
  resetHours: () => void;
  websocketState: WebsocketState;
  logThisWorkInProgress: boolean;
};

export function ButtonBar({
  clearData,
  addLast5Days,
  hamsterImport,
  createWorkLogs,
  config,
  websocketState,
  logThisWorkInProgress,
}: ButtonBarProps) {
  return (
    <div className="btn-part">
      <Button variant="contained" size="small" onClick={clearData}>
        <Delete /> Clear the data
      </Button>
      <Button variant="contained" size="small" onClick={addLast5Days}>
        <Add /> add last 5 days
      </Button>
      <Button variant="contained" size="small" onClick={hamsterImport}>
        <GetApp /> Import from Hamster
      </Button>
      <Button variant="contained" color="primary" onClick={createWorkLogs} disabled={logThisWorkInProgress}>
        <Send /> Log this work logs
      </Button>
      <StopServer websocketState={websocketState} />
      <IconButton
        target="_blank"
        href={`${config?.jiraUrl}/secure/TimesheetReport.jspa?reportKey=jira-timesheet-plugin:report&page=1&weekends=true&showDetails=true&reportingDay=1&numOfWeeks=1&offset=0&sum=day&targetUser=${config?.username}}`}
      >
        <Link />
      </IconButton>
    </div>
  );
}
