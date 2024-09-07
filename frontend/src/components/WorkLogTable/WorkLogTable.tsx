import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  ConfigData,
  IssueType,
  WorkLogTableData,
  WorksLogged,
} from "../../types";
import "./workLogTable.scss";
import { TotColRow } from "./WorkLogTableTotColRow";
import { WorkLogTableIssueRows } from "./WorkLogTableIssueRow";
import { WorkLogDateHeaderRow } from "./WorkLogDateHeaderRow";

export interface WorkLogTableProps {
  data: WorkLogTableData;
  config: ConfigData;
  worksLogged: WorksLogged;
  addRow: () => void;
  addColumn: () => void;
  removeColumn: ({ num }: { num: number }) => void;
  removeRow: ({ num }: { num: number }) => void;
  setDateValue: ({ num, date }: { num: number; date: Date }) => void;
  setHourValue: (
    { x, y, hour }: { x: number; y: number; hour: number },
  ) => void;
  onIssueKeyUpdated: (
    timeout: NodeJS.Timeout | undefined,
    setTimeoutRef: (timeout: NodeJS.Timeout) => void,
    issue: IssueType,
    y: number,
    newData: { key?: string; comment?: string },
  ) => void;
}

export const WorkLogTable: React.FC<WorkLogTableProps> = (
  {
    data,
    config,
    worksLogged,
    addRow,
    addColumn,
    removeColumn,
    removeRow,
    setDateValue,
    setHourValue,
    onIssueKeyUpdated,
  },
) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table stickyHeader size="small" style={{ overflow: "hidden" }}>
        <WorkLogDateHeaderRow
          {...{ data, removeColumn, setDateValue, addColumn }}
        />
        <TableBody>
          <WorkLogTableIssueRows
            {...{
              data,
              removeRow,
              onIssueKeyUpdated,
              setHourValue,
              jiraUrl: config.jiraUrl,
            }}
          />
          <TotColRow {...{ addRow, data, worksLogged }} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};
